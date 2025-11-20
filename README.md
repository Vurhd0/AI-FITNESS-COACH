# 💪 AI Fitness Coach App

An AI-powered fitness assistant built using Next.js that generates personalized workout and diet plans using LLMs.

## 🚀 Features

- **Personalized Plans**: Generate custom workout and diet plans based on user details
- **AI-Powered**: Uses Gemini 1.5 for intelligent plan generation
- **Voice Features**: Text-to-speech using ElevenLabs
- **Image Generation**: Visual representations of exercises and meals
- **Export to PDF**: Download your fitness plan
- **Dark/Light Mode**: Beautiful UI with theme switching
- **Local Storage**: Save your plans locally
- **Smooth Animations**: Powered by Framer Motion

## 🛠️ Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory and add your API keys. See `ENV_SETUP.md` for detailed instructions.

3. Add your API keys to `.env.local`:
- `NEXT_PUBLIC_GEMINI_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- `NEXT_PUBLIC_ELEVENLABS_API_KEY`: Get from [ElevenLabs](https://elevenlabs.io/)
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`: Get from [Unsplash](https://unsplash.com/developers)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 1.5
- **Voice**: ElevenLabs TTS
- **Images**: Unsplash API
- **Animations**: Framer Motion
- **PDF Export**: jsPDF + html2canvas

## 🚢 Deployment

### Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify
1. Push your code to GitHub
2. Import project in Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

## 📝 License

MIT

