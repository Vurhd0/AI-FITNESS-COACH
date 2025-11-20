# Gemini Model Names

If you're getting a 404 error for the model name, try these alternatives:

## Available Models (in order of preference):

1. **`gemini-pro`** - Most widely available, stable
2. **`gemini-1.5-pro`** - Newer, more capable (if available with your API key)
3. **`gemini-1.5-flash`** - Fastest, but may not be available in all regions
4. **`gemini-pro-vision`** - If you need image capabilities

## How to Check Available Models:

You can check which models are available with your API key by visiting:
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- Or use the API to list models

## Current Configuration:

The app is currently set to use `gemini-pro` which should work with most API keys.

If you want to use a different model, edit:
- `app/api/generate-plan/route.ts` (line 22)
- `app/api/motivation-quote/route.ts` (line 24)

Change `'gemini-pro'` to your preferred model name.

