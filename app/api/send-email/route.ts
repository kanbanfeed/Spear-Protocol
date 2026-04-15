import { NextRequest } from "next/server"
import jsPDF from "jspdf"
import fs from "fs"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const { email, output } = await req.json()

    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const displayDate = now.toLocaleString()

    // ===============================
    //  LOAD LOGO (SERVER SAFE)
    // ===============================
    const logoPath = path.join(process.cwd(), "public/logo-desktop.jpeg")
    const logoBuffer = fs.readFileSync(logoPath)
    const logoBase64 = logoBuffer.toString("base64")

    // ===============================
    //  CREATE PDF
    // ===============================
    const doc = new jsPDF()

    //  ADD LOGO
    doc.addImage(
      `data:image/jpeg;base64,${logoBase64}`,
      "JPEG",
      20,
      10,
      40,
      15
    )

    // Title
    doc.setFontSize(16)
    doc.text("SPEAR Protocol", 20, 35)

    // Date
    doc.setFontSize(10)
    doc.text(displayDate, 20, 42)

    // Line
    doc.line(20, 46, 190, 46)

    // Content
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(output, 170)
    doc.text(lines, 20, 55)

    // Footer
    doc.setFontSize(9)
    doc.text(
      "Private and Confidential — SPEAR Protocol — spearprotocol.com",
      20,
      285
    )

    const pdfBuffer = doc.output("arraybuffer")
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64")

    // ===============================
    //  SEND EMAIL
    // ===============================
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "SPEAR Protocol",
          email: "support@spearprotocol.com",
        },
        to: [{ email }],
        subject: "Your SPEAR Brief",
        htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #111;">
            
            <h2>SPEAR Protocol</h2>

            <p>Your decision brief is ready.</p>

            <pre style="white-space: pre-wrap; font-size: 13px; line-height: 1.5;">
${output}
            </pre>

            <hr />

            <p style="font-size: 13px;">
            Run your next decision free — share your experience at spearprotocol.com
            </p>

            <p style="font-size: 12px; color: #888;">
            Private and Confidential — SPEAR Protocol — spearprotocol.com
            </p>

        </div>
        `,
        attachment: [
          {
            content: pdfBase64,
            name: `SPEAR-Brief-${formattedDate}.pdf`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Brevo error:", err)
      return new Response("Email failed", { status: 500 })
    }

    return new Response("Email sent", { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response("Email failed", { status: 500 })
  }
}