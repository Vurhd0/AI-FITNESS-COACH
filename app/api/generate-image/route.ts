import { NextRequest, NextResponse } from 'next/server'

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY

const POLL_INTERVAL = 2000   // 2 seconds
const MAX_POLLS = 10         // 20 seconds total wait

export async function POST(request: NextRequest) {
  try {
    const { query, type } = await request.json()

    if (!FREEPIK_API_KEY) {
      return NextResponse.json({
        imageUrl: `https://via.placeholder.com/800x600/000000/FFFFFF?text=${encodeURIComponent(
          query
        )}`,
        warning: 'Freepik API key not configured'
      })
    }

    const prompt =
      type === 'exercise'
        ? `Professional fitness exercise: ${query}, gym workout, high quality, realistic, fitness photography`
        : `Delicious healthy meal: ${query}, food photography, high quality, appetizing`

    console.log("STEP 1 → Creating Freepik Mystic task...")

    // STEP 1 → Create task
    const createResponse = await fetch('https://api.freepik.com/v1/ai/mystic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': FREEPIK_API_KEY
      },
      body: JSON.stringify({
        prompt,
        size: "1024x1024",
        safety_filter: "l2"
      })
    })

    const createData = await createResponse.json()
    console.log("Create Response:", createData)

    const taskId = createData?.data?.task_id
    if (!taskId) {
      throw new Error("Task ID not returned by Freepik")
    }

    console.log("Task created:", taskId)
    console.log("STEP 2 → Polling Freepik for generated image...")

    // STEP 2 → Poll for completion
    let imageUrl = null
    let tries = 0

    while (tries < MAX_POLLS) {
      await new Promise(res => setTimeout(res, POLL_INTERVAL))

      const pollResponse = await fetch(
        `https://api.freepik.com/v1/ai/mystic/${taskId}`,
        {
          method: 'GET',
          headers: {
            'x-freepik-api-key': FREEPIK_API_KEY
          }
        }
      )

      const pollData = await pollResponse.json()
      console.log(`Poll #${tries + 1}:`, pollData)

      if (pollData?.data?.status === "COMPLETED") {
        // Handle different response formats
        const generated = pollData?.data?.generated
        
        if (Array.isArray(generated) && generated.length > 0) {
          // If generated is an array of strings (URLs) - this is the Freepik format
          if (typeof generated[0] === 'string') {
            imageUrl = generated[0]
            console.log("Image URL extracted from array:", imageUrl)
          } 
          // If generated is an array of objects with url property
          else if (generated[0]?.url) {
            imageUrl = generated[0].url
            console.log("Image URL extracted from object:", imageUrl)
          }
        } else if (pollData?.data?.generated?.url) {
          imageUrl = pollData.data.generated.url
          console.log("Image URL extracted from nested object:", imageUrl)
        } else if (pollData?.data?.url) {
          imageUrl = pollData.data.url
          console.log("Image URL extracted from data.url:", imageUrl)
        }
        
        if (imageUrl) {
          console.log("✅ FINAL IMAGE URL:", imageUrl)
          break
        } else {
          console.warn("⚠️ Status is COMPLETED but no image URL found in response")
        }
      } else if (pollData?.data?.status === "FAILED") {
        console.error("❌ Image generation failed:", pollData?.data)
        break
      }

      tries++
    }

    if (!imageUrl) {
      console.log("Image not ready after polling → using placeholder")
      return NextResponse.json({
        imageUrl: `https://via.placeholder.com/1024x1024/000000/FFFFFF?text=${encodeURIComponent(
          query
        )}`
      })
    }

    console.log("FINAL IMAGE URL:", imageUrl)

    return NextResponse.json({ imageUrl })

  } catch (error: any) {
    console.error("Error:", error)
    return NextResponse.json({
      error: error.message,
      imageUrl: `https://via.placeholder.com/800x600/000000/FFFFFF?text=Error`
    })
  }
}
