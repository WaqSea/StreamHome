import sqlite3

def check_db():
    conn = sqlite3.connect("server/database.db")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        print("Tables:", cursor.fetchall())
        
        cursor.execute("SELECT COUNT(*) FROM movie;")
        print("Movie count:", cursor.fetchone()[0])
        
        cursor.execute("SELECT COUNT(*) FROM episode;")
        print("Episode count:", cursor.fetchone()[0])
        
        cursor.execute("SELECT id, movie_id, season_number, episode_number, title FROM episode;")
        print("Episodes:")
        for r in cursor.fetchall():
            print(r)
    except Exception as e:
        print("Error:", e)
    finally:
        conn.close()

if __name__ == "__main__":
    check_db()
