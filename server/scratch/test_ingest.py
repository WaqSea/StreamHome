import httpx
import asyncio

async def test_ingest():
    url = "http://localhost:8000/api/add-movie"
    headers = {
        "Authorization": "Bearer secure-token-123"
    }
    payload = {
        "tmdb_id": 550,
        "media_type": "movie",
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        "audio_url": None,
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://images.unsplash.com/"
        }
    }
    
    print("[Test Ingest] Sending POST request to FastAPI server...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers, timeout=10.0)
            print(f"[Test Ingest] Status Code: {response.status_code}")
            print(f"[Test Ingest] Response Body: {response.json()}")
    except Exception as e:
        print(f"[Test Ingest] Request failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_ingest())
