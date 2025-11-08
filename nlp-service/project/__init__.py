from flask import Flask
import nltk

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)

    # Download NLTK Tokenizer on startup
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')

    # Register our routes (Blueprints) from main.py
    with app.app_context():
        from . import main
        app.register_blueprint(main.bp)

    return app