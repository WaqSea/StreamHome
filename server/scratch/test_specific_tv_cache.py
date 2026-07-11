import sys
import os
import asyncio

# Add server directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.tmdb import tmdb_client

async def test_specific_tv():
    item = {
        "tmdb_id": 94997,
        "type": "series",
        "title": "House of the Dragon",
        "release_year": 2022
    }
    raw_poster_url = "https://image.tmdb.org/t/p/w500/8z62pp4K602d1y6079oU1GBeiAG.jpg"
    raw_backdrop_url = "https://image.tmdb.org/t/p/original/zq22918LdWTkBstphgUfxDZUO7i.jpg"
    
    print("[Test Specific] Starting cache_media_locally for House of the Dragon...")
    try:
        await tmdb_client.cache_media_locally(item, raw_poster_url, raw_backdrop_url)
        print("[Test Specific] Completed successfully.")
    except Exception as e:
        print("[Test Specific] Error:", e)

if __name__ == "__main__":
    asyncio.run(test_specific_tv())
