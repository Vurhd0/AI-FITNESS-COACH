export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// Default voice ID - you can change this to any ElevenLabs voice ID
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel - a popular default voice

function log(msg: any) {
  process.stdout.write("[LOG] " + JSON.stringify(msg) + "\n");
}
function errorLog(msg: any) {
  process.stderr.write("[ERROR] " + JSON.stringify(msg) + "\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    log({ incoming: body });

    const { text, section } = body;

    if (!text) {
      errorLog("No text provided");
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    log("API key present? " + (ELEVENLABS_API_KEY ? "YES" : "NO"));

    if (!ELEVENLABS_API_KEY) {
      errorLog("No ElevenLabs API key found");
      return NextResponse.json(
        { error: "ElevenLabs API key is not configured" },
        { status: 500 }
      );
    }

    log({ text, section });

    // Call ElevenLabs text-to-speech API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    log({ status: response.status });

    if (!response.ok) {
      const errorText = await response.text();
      errorLog({ status: response.status, error: errorText });
      return NextResponse.json(
        { error: "Failed to generate speech", details: errorText },
        { status: response.status }
      );
    }

    // Get the audio blob
    const audioBlob = await response.blob();
    log({ blobSize: audioBlob.size });

    // Return the audio blob
    return new NextResponse(audioBlob, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBlob.size.toString(),
      },
    });
  } catch (err) {
    errorLog(err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
