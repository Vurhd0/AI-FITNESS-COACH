import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not set')
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      )
    }

    const { prompt, userDetails } = await request.json()

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    // Try gemini-pro first (most widely available), fallback to gemini-1.5-pro
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ plan: text })
  } catch (error: any) {
    console.error('Error generating plan:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate plan' },
      { status: 500 }
    )
  }
}

