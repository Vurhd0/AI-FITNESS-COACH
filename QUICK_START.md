# 🚀 Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in the root directory
2. Add your API keys (see `ENV_SETUP.md` for details):

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_key_here
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_key_here
```

**Note:** 
- Gemini API key is **required** for plan generation
- ElevenLabs API key is **required** for voice features
- Unsplash API key is **optional** (app will use free Unsplash Source if not provided)

## Step 3: Run the Development Server

```bash
npm run dev
```

## Step 4: Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Step 5: Generate Your First Plan!

1. Fill in your details in the form
2. Click "Generate My Fitness Plan"
3. Wait for AI to create your personalized plan
4. Explore features:
   - 🔊 Listen to your plan
   - 🖼️ Click exercises/meals to see images
   - 📄 Export to PDF
   - 🌗 Toggle dark/light mode

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### "Gemini API key is not configured"
- Make sure `.env.local` exists in the root directory
- Check that `NEXT_PUBLIC_GEMINI_API_KEY` is set correctly
- Restart the dev server after adding environment variables

### "Failed to generate speech"
- Check your ElevenLabs API key
- Make sure you have credits in your ElevenLabs account

### Images not loading
- If using Unsplash API, check your API key
- The app will fall back to Unsplash Source if no API key is provided

## Need Help?

Check the main `README.md` for more detailed information.

