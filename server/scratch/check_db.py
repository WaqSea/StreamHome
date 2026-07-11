import asyncio
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from db import engine
from models import Movie, Episode, PlaybackSession

async def check():
    async with AsyncSession(engine) as db:
        stmt = select(Movie)
        movies = (await db.exec(stmt)).all()
        print(f"Total Movie/Series in DB: {len(movies)}")
        for m in movies:
            print(f"  - {m.title} (ID: {m.id}, Type: {m.type}, Video URL: {m.video_url})")
            
        stmt2 = select(Episode)
        episodes = (await db.exec(stmt2)).all()
        print(f"Total Episodes in DB: {len(episodes)}")
        for ep in episodes:
            print(f"  - Episode: {ep.title} (ID: {ep.id}, Show ID: {ep.movie_id}, S{ep.season_number}E{ep.episode_number}, Video URL: {ep.video_url})")

        stmt3 = select(PlaybackSession)
        sessions = (await db.exec(stmt3)).all()
        print(f"Total PlaybackSessions in DB: {len(sessions)}")
        for s in sessions:
            print(f"  - Profile: {s.profile_id}, Movie: {s.movie_id}, Episode: {s.episode_id}, Timestamp: {s.timestamp}, Completion: {s.completion_rate}")

if __name__ == "__main__":
    asyncio.run(check())
