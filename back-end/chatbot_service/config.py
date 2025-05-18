class Config:
    PORT = 5001
    DEBUG = True
    DB_NAME = "court-services"
    DB_USER = "court_user"
    DB_PASSWORD = "court_password"
    DB_HOST = "court-db"  # Tên service trong docker-compose
    DB_PORT = "5432"