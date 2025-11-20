import { UserDetails, FitnessPlan, WorkoutPlan, DietPlan, Exercise, Meal } from '@/types'

export async function generatePlan(userDetails: UserDetails): Promise<FitnessPlan> {
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.')
  }

  const prompt = createPrompt(userDetails)
  
  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, userDetails }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to generate plan')
    }

    const data = await response.json()
    return parseGeminiResponse(data.plan, userDetails)
  } catch (error: any) {
    throw new Error(error.message || 'Failed to generate fitness plan')
  }
}

function createPrompt(userDetails: UserDetails): string {
  return `You are an expert fitness coach and nutritionist. Create a comprehensive, personalized fitness plan for the following user:

User Details:
- Name: ${userDetails.name}
- Age: ${userDetails.age}
- Gender: ${userDetails.gender}
- Height: ${userDetails.height} cm
- Weight: ${userDetails.weight} kg
- Fitness Goal: ${userDetails.fitnessGoal}
- Fitness Level: ${userDetails.fitnessLevel}
- Workout Location: ${userDetails.workoutLocation}
- Dietary Preferences: ${userDetails.dietaryPreferences}
${userDetails.medicalHistory ? `- Medical History: ${userDetails.medicalHistory}` : ''}
${userDetails.stressLevel ? `- Stress Level: ${userDetails.stressLevel}` : ''}

Please generate a detailed fitness plan in the following JSON format (respond ONLY with valid JSON, no markdown):

{
  "workoutPlan": [
    {
      "day": "Day 1",
      "focus": "Full Body Strength",
      "duration": "45 minutes",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "10-12",
          "rest": "60 seconds",
          "description": "Brief description"
        }
      ]
    }
  ],
  "dietPlan": {
    "breakfast": {
      "name": "Meal Name",
      "description": "Detailed description with ingredients",
      "calories": 400
    },
    "lunch": {
      "name": "Meal Name",
      "description": "Detailed description with ingredients",
      "calories": 600
    },
    "dinner": {
      "name": "Meal Name",
      "description": "Detailed description with ingredients",
      "calories": 500
    },
    "snacks": [
      {
        "name": "Snack Name",
        "description": "Description",
        "calories": 150
      }
    ],
    "totalCalories": 1650
  },
  "tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "motivation": [
    "Motivational quote 1",
    "Motivational quote 2"
  ]
}

Requirements:
1. Create a 7-day workout plan suitable for ${userDetails.workoutLocation} workouts
2. Exercises should be appropriate for ${userDetails.fitnessLevel} level
3. Diet plan should align with ${userDetails.dietaryPreferences} preferences
4. Consider the goal: ${userDetails.fitnessGoal}
5. Provide 5-7 practical lifestyle tips
6. Include 3-5 motivational quotes
7. Ensure exercises are safe and progressive
8. Calculate appropriate calorie intake based on user's goals and stats`
}

function parseGeminiResponse(responseText: string, userDetails: UserDetails): FitnessPlan {
  try {
    // Clean the response - remove markdown code blocks if present
    let cleaned = responseText.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '')
    }

    const parsed = JSON.parse(cleaned)
    
    // Ensure proper structure
    const workoutPlan: WorkoutPlan[] = parsed.workoutPlan || []
    const dietPlan: DietPlan = parsed.dietPlan || {
      breakfast: { name: '', description: '' },
      lunch: { name: '', description: '' },
      dinner: { name: '', description: '' },
      snacks: [],
    }
    const tips: string[] = parsed.tips || []
    const motivation: string[] = parsed.motivation || []

    return {
      userDetails,
      workoutPlan,
      dietPlan,
      tips,
      motivation,
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error parsing Gemini response:', error)
    throw new Error('Failed to parse AI response. Please try again.')
  }
}

export async function generateSpeech(text: string, section: 'workout' | 'diet'): Promise<string> {
  const response = await fetch('/api/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, section }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate speech')
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

// Cache key generator
function getImageCacheKey(query: string, type: 'exercise' | 'meal'): string {
  return `fitness_image_${type}_${query.toLowerCase().replace(/\s+/g, '_')}`
}

// Get cached image URL
export function getCachedImage(query: string, type: 'exercise' | 'meal'): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cacheKey = getImageCacheKey(query, type)
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const data = JSON.parse(cached)
      const url = data.url
      // Only return if it's a valid URL (not placeholder)
      if (url && !url.includes('placeholder') && !url.includes('Error')) {
        console.log('Found cached image for:', query, url)
        return url
      } else {
        // Remove invalid cache entry
        localStorage.removeItem(cacheKey)
        console.log('Removed invalid cache entry for:', query)
      }
    }
  } catch (error) {
    console.error('Error reading image cache:', error)
  }
  return null
}

// Save image URL to cache
export function cacheImage(query: string, type: 'exercise' | 'meal', imageUrl: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const cacheKey = getImageCacheKey(query, type)
    const cacheData = {
      url: imageUrl,
      timestamp: Date.now(),
      query,
      type,
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error caching image:', error)
  }
}

export async function generateImage(query: string, type: 'exercise' | 'meal'): Promise<string> {
  // Check cache first
  const cachedUrl = getCachedImage(query, type)
  if (cachedUrl) {
    console.log('Using cached image for:', query)
    return cachedUrl
  }

  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, type }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to generate image: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.imageUrl) {
      throw new Error('No image URL returned from API')
    }
    
    // Only cache if it's a real image URL (not placeholder)
    if (data.imageUrl && !data.imageUrl.includes('placeholder') && !data.imageUrl.includes('Error')) {
      cacheImage(query, type, data.imageUrl)
      console.log('Image generated and cached for:', query, data.imageUrl)
    } else {
      console.warn('Not caching placeholder image for:', query)
    }
    
    return data.imageUrl
  } catch (error: any) {
    console.error('generateImage error:', error)
    throw error
  }
}

