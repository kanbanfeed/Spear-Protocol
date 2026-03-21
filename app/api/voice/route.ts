import { NextRequest } from "next/server"

//  Extract only required sections
function extractRelevantText(text: string) {
  const phase1Match = text.match(/PHASE I[\s\S]*?(?=PHASE II)/)
  const phase2Match = text.match(/PHASE II[\s\S]*?(?=PHASE III)/)
  const pathAMatch = text.match(/PATH A[\s\S]*?(?=PATH B)/)

  let result = ""

  if (phase1Match) result += phase1Match[0] + "\n\n"
  if (phase2Match) result += phase2Match[0] + "\n\n"
  if (pathAMatch) result += pathAMatch[0]

  return result.trim()
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return new Response("No text provided", { status: 400 })
    }

    //  STRICT TRIM (free plan safe)
    const trimmedText = extractRelevantText(text).slice(0, 1200)

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: "eleven_multilingual_v2", //  free-tier supported
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    )

    //  Handle API errors
    if (!response.ok) {
      const errorText = await response.text()
      console.error(" ElevenLabs API Error:", errorText)
      return new Response("Failed to generate audio", { status: 500 })
    }

    const contentType = response.headers.get("content-type")

    if (!contentType || !contentType.includes("audio")) {
      const errorText = await response.text()
      console.error(" Invalid audio response:", errorText)
      return new Response("Invalid audio response", { status: 500 })
    }

    const audioBuffer = await response.arrayBuffer()

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (error) {
    console.error(" Voice API error:", error)
    return new Response("Error generating audio", { status: 500 })
  }
}