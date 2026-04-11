from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# ── Startup diagnostic: confirm API key is loaded ──────────────────────
_key = os.getenv('GEMINI_API_KEY')
if _key:
    print(f"[ENV] GEMINI_API_KEY loaded: {_key[:10]}...{_key[-4:]} ({len(_key)} chars)")
else:
    print("[ENV] WARNING: GEMINI_API_KEY is NOT set! Guidance will use fallback only.")

from project import create_app

# Create the app instance using our factory
app = create_app()

if __name__ == '__main__':
    # Run the app
    # Note: We set debug=True here for development, but disabled the reloader to prevent double-loading massive ML models.
    app.run(debug=True, port=5001, use_reloader=False)