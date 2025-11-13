"""API package initialization and seeding entry point."""
from api.seed import seed_database

if __name__ == "__main__":
    seed_database()
