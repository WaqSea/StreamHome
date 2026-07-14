import os
import json
import time
import shutil
import asyncio
import subprocess
from datetime import datetime, timedelta
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from db import engine
from models import Movie, Episode, PlaybackSession
from config import settings, config_dir
from services.logger import logger

class HEVCCompressorWorker:
    def __init__(self):
        self.loop_task = None
        self.is_running = False
        self.active_process = None

    def start(self):
        if not self.is_running:
            self.is_running = True
            self.loop_task = asyncio.create_task(self._worker_loop())
            logger.info("[HEVC Compressor] Background worker loop started.")

    def stop(self):
        self.is_running = False
        if self.active_process:
            try:
                self.active_process.kill()
            except Exception:
                pass
        if self.loop_task:
            self.loop_task.cancel()
            logger.info("[HEVC Compressor] Background worker loop stopped.")

    def _get_cpu_cores(self) -> int:
        try:
            profile_path = os.path.join(config_dir, "system_profile.json")
            if os.path.exists(profile_path):
                with open(profile_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return data.get("cpu_cores", 2)
        except Exception:
            pass
        return os.cpu_count() or 2

    async def _is_server_idle(self) -> bool:
        """Check if any playback session was updated in the last 15 minutes."""
        try:
            async with AsyncSession(engine) as db:
                stmt = select(PlaybackSession).order_by(PlaybackSession.updated_at.desc()).limit(1)
                result = await db.exec(stmt)
                last_session = result.first()
                if last_session:
                    try:
                        last_updated = datetime.fromisoformat(last_session.updated_at.replace("Z", "+00:00"))
                        now = datetime.utcnow()
                        if last_updated.tzinfo is not None:
                            now = datetime.now(last_updated.tzinfo)
                        
                        diff = now - last_updated
                        if diff.total_seconds() < 15 * 60:
                            return False
                    except Exception as e:
                        pass
        except Exception:
            pass
        return True

    async def _check_codec(self, file_path: str) -> str:
        ffprobe_path = shutil.which("ffprobe") or r"C:\ffmpeg\bin\ffprobe.exe"
        cmd = [
            ffprobe_path,
            "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=codec_name",
            "-of", "default=noprint_wrappers=1:nokey=1",
            file_path
        ]
        try:
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )
            stdout, _ = await process.communicate()
            return stdout.decode().strip().lower()
        except Exception as e:
            logger.error(f"[HEVC Compressor] ffprobe error: {e}")
            return "unknown"

    async def _worker_loop(self):
        ffmpeg_path = shutil.which("ffmpeg") or r"C:\ffmpeg\bin\ffmpeg.exe"
        
        while self.is_running:
            try:
                await asyncio.sleep(60.0)  # Check every minute
                
                mode = getattr(settings, "HEVC_COMPRESSION_MODE", "auto")
                if mode == "off":
                    continue
                    
                if mode == "auto":
                    cores = self._get_cpu_cores()
                    if cores < 4:
                        continue # Skip on weak CPUs
                
                # Check active user guard
                idle = await self._is_server_idle()
                if not idle:
                    continue
                
                # Find an uncompressed file
                async with AsyncSession(engine) as db:
                    # Check Movies
                    stmt = select(Movie).where(Movie.hevc_compressed == False).limit(1)
                    res = await db.exec(stmt)
                    item = res.first()
                    
                    if not item:
                        # Check Episodes
                        stmt = select(Episode).where(Episode.hevc_compressed == False).limit(1)
                        res = await db.exec(stmt)
                        item = res.first()
                        
                if not item:
                    continue # Everything is compressed
                
                file_path = os.path.abspath(item.video_url)
                if not os.path.exists(file_path) or file_path.startswith("http"):
                    # Mark as processed if file is missing or cloud stream so we don't get stuck
                    async with AsyncSession(engine) as db:
                        db.add(item)
                        item.hevc_compressed = True
                        await db.commit()
                    continue

                codec = await self._check_codec(file_path)
                if codec in ["hevc", "h265"]:
                    # Already HEVC! Mark as done.
                    async with AsyncSession(engine) as db:
                        db.add(item)
                        item.hevc_compressed = True
                        await db.commit()
                    logger.info(f"[HEVC Compressor] {file_path} is already HEVC. Skipping.")
                    continue
                
                # Ready to transcode
                temp_file = file_path + ".hevc.mp4.tmp"
                logger.info(f"[HEVC Compressor] Starting background HEVC compression for: {file_path}")
                
                cmd = [
                    ffmpeg_path,
                    "-y",
                    "-i", file_path,
                    "-c:v", "libx265",
                    "-preset", "medium",
                    "-crf", "28",
                    "-c:a", "copy",
                    "-threads", "2",
                    temp_file
                ]
                
                self.active_process = await asyncio.create_subprocess_exec(
                    *cmd,
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.DEVNULL,
                    creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
                )
                
                # Watcher loop while process is running
                killed = False
                while self.active_process.returncode is None:
                    await asyncio.sleep(15.0)
                    idle = await self._is_server_idle()
                    if not idle:
                        logger.info(f"[HEVC Compressor] Active user detected! Killing compression for {file_path}")
                        try:
                            self.active_process.kill()
                            killed = True
                        except Exception:
                            pass
                        break
                
                await self.active_process.wait()
                self.active_process = None
                
                if killed:
                    if os.path.exists(temp_file):
                        os.remove(temp_file)
                    await asyncio.sleep(5 * 60) # Sleep 5 mins after a kill before checking again
                    continue
                
                if os.path.exists(temp_file) and os.path.getsize(temp_file) > 1024:
                    # Success
                    os.replace(temp_file, file_path)
                    async with AsyncSession(engine) as db:
                        db.add(item)
                        item.hevc_compressed = True
                        await db.commit()
                    logger.info(f"[HEVC Compressor] Successfully swapped and compressed {file_path}!")
                else:
                    if os.path.exists(temp_file):
                        os.remove(temp_file)
                        
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[HEVC Compressor] Error in worker loop: {e}")

hevc_compressor = HEVCCompressorWorker()
