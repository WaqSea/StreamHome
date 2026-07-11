import asyncio, aiosqlite
from config import settings

async def go():
    db_path = settings.DATABASE_URL.replace("sqlite+aiosqlite:///", "")
    conn = await aiosqlite.connect(db_path)

    cur = await conn.execute("SELECT * FROM movie")
    cols = [d[0] for d in cur.description]
    print("=== Movies ===")
    for row in await cur.fetchall():
        d = dict(zip(cols, row))
        print(f"  id={d['id']}")
        print(f"  title={d['title']}")
        print(f"  duration={d['duration']}")
        print()

    cur = await conn.execute("SELECT * FROM playbacksession")
    cols = [d[0] for d in cur.description]
    print("=== PlaybackSessions ===")
    for row in await cur.fetchall():
        d = dict(zip(cols, row))
        print(f"  profile_id={d['profile_id']}, movie_id={d['movie_id']}, timestamp={d['timestamp']}, duration_watched={d['duration_watched']}, completion_rate={d['completion_rate']}")

    await conn.close()

asyncio.run(go())
