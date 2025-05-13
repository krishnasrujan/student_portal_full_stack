from flask import Flask
from config import get_config
from db import init_db, db
from routes import main
from flasgger import Swagger
from flask_cors import CORS  


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(get_config())

    # Attach Swagger UI
    Swagger(app, template_file='swagger.yaml')


    init_db(app)
    with app.app_context():
        db.create_all()
        print("Tables created successfully.")
    app.register_blueprint(main)
    CORS(app)  # Enable CORS for the entire app

    return app

if __name__ == '__main__':
    app = create_app('dev')
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)