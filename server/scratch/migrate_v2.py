import aiosqlite
from config import settings
import sys

def extract_path(db_url: str) -> str:
    prefix = "sqlite+aiosqlite:///"
    if db_url.startswith(prefix):
        return db_url[len(prefix):]
    return db_url

async def migrate():
    db_path = extract_path(settings.DATABASE_URL)
    print(f"[Migration] Opening database: {db_path}")
    async with aiosqlite.connect(db_path) as conn:
        cursor = await conn.execute("PRAGMA table_info(movie)")
        cols = {row[1] for row in await cursor.fetchall()}
        print(f"[Migration] Existing movie columns: {cols}")

        if "quality" not in cols:
            await conn.execute("ALTER TABLE movie ADD COLUMN quality TEXT DEFAULT 'Source'")
            print("[Migration] Added quality to movie")
        if "languages_str" not in cols:
            await conn.execute("ALTER TABLE movie ADD COLUMN languages_str TEXT DEFAULT '[\"en\"]'")
            print("[Migration] Added languages_str to movie")
        if "subtitles_str" not in cols:
            await conn.execute("ALTER TABLE movie ADD COLUMN subtitles_str TEXT DEFAULT '[]'")
            print("[Migration] Added subtitles_str to movie")

        cursor = await conn.execute("PRAGMA table_info(episode)")
        cols = {row[1] for row in await cursor.fetchall()}
        print(f"[Migration] Existing episode columns: {cols}")

        if "quality" not in cols:
            await conn.execute("ALTER TABLE episode ADD COLUMN quality TEXT DEFAULT 'Source'")
            print("[Migration] Added quality to episode")
        if "languages_str" not in cols:
            await conn.execute("ALTER TABLE episode ADD COLUMN languages_str TEXT DEFAULT '[\"en\"]'")
            print("[Migration] Added languages_str to episode")
        if "subtitles_str" not in cols:
            await conn.execute("ALTER TABLE episode ADD COLUMN subtitles_str TEXT DEFAULT '[]'")
            print("[Migration] Added subtitles_str to episode")

        await conn.commit()
        print("[Migration] Migration complete")

if __name__ == "__main__":
    import asyncio
    asyncio.run(migrate())
