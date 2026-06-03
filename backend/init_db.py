import asyncio
import asyncpg
import sys

async def init_db():
    try:
        conn = await asyncpg.connect("postgresql://postgres:postgres@localhost:5432/postgres")
        try:
            await conn.execute('CREATE DATABASE opportunity_radar')
            print("Database 'opportunity_radar' created.")
        except asyncpg.exceptions.DuplicateDatabaseError:
            print("Database 'opportunity_radar' already exists.")
        finally:
            await conn.close()
    except Exception as e:
        print(f"Failed to connect to postgres: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(init_db())
