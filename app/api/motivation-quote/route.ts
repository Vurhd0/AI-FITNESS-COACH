import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const defaultQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can do it. It's your mind you need to convince.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  "Take care of your body. It's the only place you have to live.",
  "The pain you feel today will be the strength you feel tomorrow.",
]

export async function GET() {
  try {
    if (!GEMINI_API_KEY) {
      // Return a random default quote if API key is not configured
      return NextResponse.json({
        quote: defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)],
      })
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    // Try gemini-pro first (most widely available), fallback to gemini-1.5-pro
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro' })

    const prompt = 'Generate a short, inspiring fitness motivation quote (one sentence, maximum 20 words). Return only the quote text, no additional formatting.'

    const result = await model.generateContent(prompt)
    const response = await result.response
    const quote = response.text().trim().replace(/^["']|["']$/g, '')

    return NextResponse.json({ quote })
  } catch (error: any) {
    console.error('Error generating motivation quote:', error)
    // Fallback to default quote
    return NextResponse.json({
      quote: defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)],
    })
  }
}

