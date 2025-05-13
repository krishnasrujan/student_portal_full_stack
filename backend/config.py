import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI') or 'postgresql://rkrishnasrujan:22krish22@localhost:5432/school_vaccination'
    DEBUG = os.environ.get('FLASK_DEBUG') or True

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config_by_name = dict(
    dev=DevelopmentConfig,
    prod=ProductionConfig
)

def get_config():
    """
    Function to get the appropriate configuration based on the environment.
    """
    config_name = os.getenv('FLASK_ENV') or 'dev'
    return config_by_name[config_name]