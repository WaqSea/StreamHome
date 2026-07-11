import sys
import os
import asyncio

# Add server directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.tmdb import tmdb_client

async def test_discover_caching():
    print("[Test Discover] Requesting discover_media for 'action' as a TV Show...")
    results = await tmdb_client.discover_media("action", media_type="tv")
    print(f"[Test Discover] Got {len(results)} results from TMDB.")
    
    if len(results) > 0:
        first = results[0]
        print(f"[Test Discover] First result: {first['title']} (TMDB ID: {first['tmdb_id']})")
        
        # Sleep for a few seconds to let background asyncio.create_task calls execute
        print("[Test Discover] Waiting 15 seconds for background sequential caching tasks to complete...")
        await asyncio.sleep(15.0)
        
        # Now, let's verify if the media folder was created locally
        media_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "media", "Series"))
        print(f"[Test Discover] Checking directory: {media_dir}")
        if os.path.exists(media_dir):
            folders = os.listdir(media_dir)
            print(f"[Test Discover] Created series folders: {folders}")
            
            # Find the folder for our first series
            clean_title = "".join(c for c in first['title'] if c.isalnum() or c in " .-_")
            target_folder = f"{clean_title}_TMDB_{first['tmdb_id']}"
            target_path = os.path.join(media_dir, target_folder)
            
            print(f"[Test Discover] Checking specific series folder: {target_path}")
            if os.path.exists(target_path):
                subdirs = os.listdir(target_path)
                print(f"[Test Discover] Series Folder exists! Contents: {subdirs}")
                
                # Check for all seasons
                seasons = [d for d in subdirs if d.startswith("Season_")]
                print(f"[Test Discover] Found seasons: {seasons}")
                
                for s_dir in seasons:
                    season_path = os.path.join(target_path, s_dir)
                    episodes = os.listdir(season_path)
                    print(f"[Test Discover] Season {s_dir} contains episodes: {episodes}")
                    
                    if len(episodes) > 0:
                        # Check the first episode
                        ep_dir = os.path.join(season_path, episodes[0])
                        ep_contents = os.listdir(ep_dir)
                        print(f"  - Episode folder {episodes[0]} contents: {ep_contents}")
                        
                        # Verify NO .mp4 file was created
                        mp4_files = [f for f in ep_contents if f.endswith(".mp4")]
                        print(f"  - .mp4 files inside episode folder: {mp4_files} (Should be empty list!)")
                        
                        poster_path = os.path.join(ep_dir, "poster.jpg")
                        backdrop_path = os.path.join(ep_dir, "backdrop.jpg")
                        thumbnail_path = os.path.join(ep_dir, "thumbnail.jpg")
                        meta_dir = os.path.join(ep_dir, ".metadata")
                        
                        print(f"  - poster.jpg exists: {os.path.exists(poster_path)}")
                        print(f"  - backdrop.jpg exists: {os.path.exists(backdrop_path)}")
                        print(f"  - thumbnail.jpg exists: {os.path.exists(thumbnail_path)}")
                        print(f"  - .metadata exists: {os.path.exists(meta_dir)}")
                        
                        if os.path.exists(meta_dir):
                            meta_json = os.path.join(meta_dir, "metadata.json")
                            if os.path.exists(meta_json):
                                with open(meta_json, "r", encoding="utf-8") as f:
                                    print(f"  - metadata.json content first 100 chars: {f.read()[:100]}...")
            else:
                print("[Test Discover] Error: Specific target folder was not found on disk!")
        else:
            print("[Test Discover] Error: Series directory does not exist!")

if __name__ == "__main__":
    asyncio.run(test_discover_caching())
