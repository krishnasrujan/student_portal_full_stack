from flask import Flask
from .config import get_config
from .db import init_db, db
from .routes import main

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(get_config())

    init_db(app)
    app.register_blueprint(main)

    return app

if __name__ == '__main__':
    app = create_app('dev')
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)