import { NextRequest } from "next/server"
import jsPDF from "jspdf"

export async function POST(req: NextRequest) {
  try {
    const { email, output } = await req.json()

    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const displayDate = now.toLocaleString()

    //  Create PDF
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("SPEAR Protocol", 20, 20)

    doc.setFontSize(10)
    doc.text(displayDate, 20, 28)

    doc.line(20, 32, 190, 32)

    doc.setFontSize(11)
    const lines = doc.splitTextToSize(output, 170)
    doc.text(lines, 20, 40)

    doc.setFontSize(9)
    doc.text(
      "Private and Confidential — SPEAR Protocol — spearprotocol.com",
      20,
      285
    )

    const pdfBuffer = doc.output("arraybuffer")

    //  Convert to base64
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64")

    //  Send via Brevo
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
            
            <h2 style="margin-bottom: 10px;">SPEAR Protocol</h2>
            
            <p style="font-size: 14px; color: #555;">
            Your decision brief has been generated successfully.
            </p>

            <p style="font-size: 14px; color: #555;">
            You can download your brief using the button below.
            </p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

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