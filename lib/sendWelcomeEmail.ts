export async function sendWelcomeEmail(email: string) {
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
      subject: "Access Confirmed — SPEAR Protocol",
      htmlContent: `
        <div style="font-family: serif; color:#121212; line-height:1.6;">
          <p>Your Founding Access is now active.</p>

          <p>This is not a subscription.<br/>
          It is a private decision environment.</p>

          <p>Access your console below:</p>

          <p>
            <a href="https://spearprotocol.com/dashboard"
               style="display:inline-block;
                      padding:12px 24px;
                      background:#121212;
                      color:#ffffff;
                      text-decoration:none;
                      font-size:12px;
                      letter-spacing:2px;">
               ENTER SPEAR PROTOCOL
            </a>
          </p>

          <p>Use it before decisions harden.<br/>
          Not after they collapse.</p>

          <p>SPEAR Protocol</p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Brevo error: ${error}`)
  }
}