export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const FREEPIK_API_KEY = process.env.NEXT_PUBLIC_FREEPIK_API_KEY;

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

    const { query, type } = body;

    log("API key present? " + (FREEPIK_API_KEY ? "YES" : "NO"));

    if (!FREEPIK_API_KEY) {
      errorLog("No Freepik API key found");
      return NextResponse.json({
        imageUrl: `https://via.placeholder.com/800x600?text=${encodeURIComponent(
          query
        )}`,
      });
    }

    const prompt =
      type === "exercise"
        ? `Professional fitness exercise: ${query}`
        : `Delicious healthy meal: ${query}`;

    log({ prompt });

    const payload = {
      prompt,
      size: "1024x1024",
      safety_filter: "l2",
    };

    log({ sendingPayload: payload });

    const response = await fetch(
      "https://api.freepik.com/v1/ai/text-to-image/google/gemini-2-5-flash-image-preview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-freepik-api-key": FREEPIK_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    log({ status: response.status });

    const raw = await response.text();
    log({ rawResponse: raw });

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      errorLog("JSON parse failed");
      return NextResponse.json({
        imageUrl: `https://via.placeholder.com/800x600?text=Invalid+Response`,
      });
    }

    log({ parsed: data });

    const url =
      data?.data?.url ||
      data?.data?.image_url ||
      data?.url ||
      data?.image_url;

    log({ extractedURL: url });

    if (url) return NextResponse.json({ imageUrl: url });

    errorLog("No valid image URL found");
    return NextResponse.json({
      imageUrl: `https://via.placeholder.com/800x600?text=No+Image`,
    });
  } catch (err) {
    errorLog(err);
    return NextResponse.json({
      imageUrl: `https://via.placeholder.com/800x600?text=Error`,
    });
  }
}
