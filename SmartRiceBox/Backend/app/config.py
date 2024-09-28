from dotenv import load_dotenv
import os
load_dotenv(".env")

class Settings():
    database_hostname = os.getenv("database_hostname")
    database_port = int(os.getenv("database_port"))
    database_username = os.getenv("database_username")
    database_password = os.getenv("database_password")
    database_name = os.getenv("database_name")
    secret_key = os.getenv("secret_key")
    algorithm = os.getenv("algorithm")
    access_token_expire_minutes = int(os.getenv("access_token_expire_minutes"))
    thingsboard_username = os.getenv("thingsboard_username")
    thingsboard_password = os.getenv("thingsboard_password")
    opencage_api_key = os.getenv("opencage_api_key")
    thingsboard_url = os.getenv("thingsboard_url")
    mapbox_api = os.getenv("mapbox_api")

settings = Settings()