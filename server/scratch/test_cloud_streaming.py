import sys
import os
import asyncio
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient

# Set PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from routes.stream import router, ACTIVE_CLOUD_DOWNLOADS, get_rclone_path
from config import settings

app = FastAPI()
app.include_router(router)

# Mock database dependency for stream_media
from db import get_session
from models import Movie
from sqlmodel.ext.asyncio.session import AsyncSession

async def mock_get_session():
    class MockDb:
        async def execute(self, stmt):
            class MockResult:
                def scalars(self):
                    class MockScalars:
                        def first(self):
                            # Return a mock Movie with a video_url that is not on disk
                            return Movie(
                                id="m_test_cloud_movie",
                                title="Test Cloud Movie",
                                description="A mock movie for testing cloud streaming fallback",
                                thumbnail_url="",
                                video_url="/media/Movies/Test_Cloud_Movie_TMDB_123/Test_Cloud_Movie.mp4",
                                duration="1h 30m",
                                release_year=2026,
                                genres_str="[]",
                                cast_str="[]"
                            )
                    return MockScalars()
            return MockResult()
    yield MockDb()

app.dependency_overrides[get_session] = mock_get_session

from routes.auth import get_current_user
app.dependency_overrides[get_current_user] = lambda: "mock_user"

# Mock download_file_from_cloud_task to verify it is called
download_called_with = None

async def mock_download_task(target_remote, abs_path):
    global download_called_with
    download_called_with = (target_remote, abs_path)
    print(f"  [Mock Task] Triggered download task: {target_remote} -> {abs_path}")

import routes.stream
routes.stream.download_file_from_cloud_task = mock_download_task

# Mock get_rclone_path to return None so lsjson is skipped cleanly if Rclone is not installed
routes.stream.get_rclone_path = lambda: None

def run_tests():
    global download_called_with
    
    # Enable CLOUD storage engine
    settings.STORAGE_ENGINE = "CLOUD"
    settings.RCLONE_REMOTE_PATH = "gdrive:media"
    
    client = TestClient(app)
    
    print("=== Testing Cloud Streaming Fallback ===")
    
    # 1. Invoke GET /api/stream/m_test_cloud_movie without Range header
    res = client.get("/api/stream/m_test_cloud_movie")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    print("  [OK] Streaming response initiated successfully (200)")
    
    # 2. Check if background download was triggered
    assert download_called_with is not None, "Expected background download to be triggered!"
    target_remote, abs_path = download_called_with
    assert target_remote == "gdrive:media/Movies/Test_Cloud_Movie_TMDB_123/Test_Cloud_Movie.mp4"
    assert abs_path.replace("\\", "/").endswith("media/Movies/Test_Cloud_Movie_TMDB_123/Test_Cloud_Movie.mp4")
    print("  [OK] Background download triggered with correct remote/local paths")
    
    # Reset call tracer
    download_called_with = None
    
    # 3. Invoke GET /api/stream/m_test_cloud_movie with Range header
    res = client.get("/api/stream/m_test_cloud_movie", headers={"Range": "bytes=5000-10000"})
    assert res.status_code == 206, f"Expected 206, got {res.status_code}"
    # Verify Content-Range header is present
    assert "Content-Range" in res.headers, "Expected Content-Range header"
    print(f"  [OK] Byte range stream response initiated successfully (206) - Content-Range: {res.headers['Content-Range']}")
    
    print("\n[OK] All cloud streaming fallback tests passed successfully!")

if __name__ == "__main__":
    run_tests()
