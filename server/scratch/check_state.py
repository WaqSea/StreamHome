import asyncio, aiosqlite
from config import settings

async def go():
    db_path = settings.DATABASE_URL.replace("sqlite+aiosqlite:///", "")
    conn = await aiosqlite.connect(db_path)

    cur = await conn.execute("SELECT name FROM sqlite_master WHERE type='table'")
    print("Tables:", [t[0] for t in await cur.fetchall()])

    cur = await conn.execute("SELECT * FROM profile")
    cols = [d[0] for d in cur.description]
    print("\n=== Profiles ===")
    for row in await cur.fetchall():
        print(dict(zip(cols, row)))

    cur = await conn.execute("SELECT * FROM playbacksession")
    cols = [d[0] for d in cur.description]
    print("\n=== PlaybackSessions ===")
    for row in await cur.fetchall():
        print(dict(zip(cols, row)))

    await conn.close()

asyncio.run(go())
