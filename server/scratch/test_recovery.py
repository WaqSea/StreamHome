import sys
import os
import asyncio

# Add server directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from db import init_db
from services.queue import queue_manager

async def test_recovery():
    print("[Test Recovery] Initializing database...")
    await init_db()
    print("[Test Recovery] Calling sync_media_from_disk to see if it recovers Fight Club and skips empty series...")
    await queue_manager.sync_media_from_disk()
    print("[Test Recovery] Completed.")

if __name__ == "__main__":
    asyncio.run(test_recovery())
