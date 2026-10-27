import os
from pathlib import Path
from email.message import EmailMessage
from dotenv import load_dotenv
from flask import Flask

from routes.main import main_bp
from routes.works import works_bp
from routes.linkedlist import linkedlist_bp
from routes.infix_postfix import infix_bp
from routes.contact import contact_bp
from routes.stack import stack_bp
from routes.sorting import sorting_bp
from routes.queue import queue_bp
from routes.deque import deque_bp

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

print("ENV FILE EXISTS:", (BASE_DIR / ".env").is_file())
print("GMAIL ADDRESS FOUND:", bool(os.getenv("GMAIL_ADDRESS")))
print("GMAIL PASSWORD FOUND:", bool(os.getenv("GMAIL_APP_PASSWORD")))


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "stack-lab-dev-key-change-later"

    app.register_blueprint(main_bp)
    app.register_blueprint(works_bp)
    app.register_blueprint(linkedlist_bp)
    app.register_blueprint(infix_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(stack_bp)
    app.register_blueprint(sorting_bp)
    app.register_blueprint(queue_bp)
    app.register_blueprint(deque_bp)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
