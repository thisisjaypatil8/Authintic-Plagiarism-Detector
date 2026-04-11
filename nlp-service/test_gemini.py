"""Quick diagnostic: does the Gemini API key actually work?"""
from dotenv import load_dotenv
import os
load_dotenv()

from google import genai

key = os.getenv('GEMINI_API_KEY')
print(f"Key: {key[:10]}...{key[-4:]}")

client = genai.Client(api_key=key)

# List available models first
print("\n--- Available Gemini models ---")
for m in client.models.list():
    if 'flash' in m.name.lower() or 'gemini' in m.name.lower():
        print(f"  {m.name}")

# Try a simple generation
print("\n--- Test generation ---")
try:
    resp = client.models.generate_content(
        model='gemini-2.0-flash',
        contents='Say "hello" in one word.'
    )
    print(f"SUCCESS: {resp.text}")
except Exception as e:
    print(f"FAILED: {e}")
