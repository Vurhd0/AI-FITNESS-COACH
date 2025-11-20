# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Gemini API Key - Get from https://makersuite.google.com/app/apikey
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# ElevenLabs API Key - Get from https://elevenlabs.io/
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Freepik API Key (Optional) - Get from https://www.freepik.com/api/
# Free credits available with email signup - works like nanobanana
# If not provided, the app will use placeholder images
NEXT_PUBLIC_FREEPIK_API_KEY=your_freepik_api_key_here
```

## Getting API Keys

### 1. Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env.local`

### 2. ElevenLabs API Key
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Go to your profile settings
4. Navigate to API Keys section
5. Create a new API key
6. Copy the key and paste it in `.env.local`

### 3. Freepik API Key (Optional)
1. Go to [Freepik API](https://www.freepik.com/api/)
2. Sign up with your email (free credits available)
3. Get your API key from the dashboard
4. Copy the key and paste it in `.env.local`

**Note:** Freepik offers free credits with email signup, similar to nanobanana. If you don't provide a Freepik API key, the app will use placeholder images.

