import sys
import os
import asyncio
import json

# Add server directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.tmdb import tmdb_client

async def test_debug_tv():
    data = await tmdb_client._get("/tv/94997")
    if data:
        print("Keys:", list(data.keys()))
        seasons = data.get("seasons", [])
        print("Seasons count:", len(seasons))
        for s in seasons:
            print(f"Season {s.get('season_number')}: {s.get('name')} - {s.get('episode_count')} episodes")
    else:
        print("Failed to fetch tv show!")

if __name__ == "__main__":
    asyncio.run(test_debug_tv())
