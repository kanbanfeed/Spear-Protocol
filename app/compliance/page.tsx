export const runtime = "nodejs"

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-white text-[#121212] px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-12 text-[15px] leading-relaxed">

        <h1 className="text-3xl font-serif tracking-tight">
          SPEAR PROTOCOL –COMPLIANCE
        </h1>

        {/* 1️⃣ TERMS OF SERVICE */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif">1️⃣ TERMS OF SERVICE (MANDATORY)</h2>

          <p><strong>Effective Date:</strong> 2/3/2026</p>
          <p><strong>Entity Name:</strong> SPEAR Protocol</p>
          <p><strong>Registered Entity (if applicable):</strong> Spear Protocol ltd</p>
          <p><strong>Jurisdiction:</strong> US,UK/Europe</p>

          <h3 className="font-semibold">1. Agreement to Terms</h3>
          <p>By accessing or using SPEAR Protocol (“Service”), you agree to these legally binding Terms.</p>
          <p>If you do not agree, discontinue use immediately.</p>

          <h3 className="font-semibold">2. Nature of Service</h3>
          <p>SPEAR Protocol provides a structured decision-review framework designed to help users analyze high-impact strategic decisions.</p>
          <p>The Service:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Is informational and analytical in nature</li>
            <li>Does NOT provide legal, financial, investment, psychological, or professional advice</li>
            <li>Does NOT guarantee outcomes</li>
          </ul>
          <p>Users are solely responsible for decisions made.</p>

          <h3 className="font-semibold">3. Eligibility</h3>
          <p>You must be 18+ years of age and legally capable of entering into contracts.</p>

          <h3 className="font-semibold">4. Account Responsibilities</h3>
          <p>Users agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate registration data</li>
            <li>Maintain confidentiality of login credentials</li>
            <li>Notify us of unauthorized access</li>
          </ul>
          <p>We reserve the right to suspend accounts for misuse.</p>

          <h3 className="font-semibold">5. Subscription & Payments</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access requires payment of displayed fees.</li>
            <li>Payments are processed via third-party PCI-DSS compliant providers.</li>
            <li>Subscriptions may auto-renew unless cancelled before renewal.</li>
          </ul>
          <p>All pricing is exclusive of applicable taxes.</p>

          <h3 className="font-semibold">6. Refund Policy</h3>
          <p>Unless required by law:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Fees are non-refundable.</li>
            <li>No refunds for partial subscription periods.</li>
          </ul>

          <h3 className="font-semibold">7. Intellectual Property</h3>
          <p>All frameworks, methodologies, software code, branding, and content are proprietary to SPEAR Protocol.</p>
          <p>Users may not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Copy</li>
            <li>Resell</li>
            <li>Reverse engineer</li>
            <li>Reproduce</li>
          </ul>

          <h3 className="font-semibold">8. Acceptable Use</h3>
          <p>You agree NOT to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the platform for illegal activity</li>
            <li>Attempt to breach security</li>
            <li>Scrape data</li>
            <li>Upload malicious code</li>
          </ul>

          <h3 className="font-semibold">9. Disclaimer of Warranties</h3>
          <p>The Service is provided “AS IS” without warranties of any kind.</p>
          <p>We do not guarantee:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Decision success</li>
            <li>Business performance</li>
            <li>Strategic outcomes</li>
          </ul>

          <h3 className="font-semibold">10. Limitation of Liability</h3>
          <p>To the maximum extent permitted by law:</p>
          <p>SPEAR Protocol shall not be liable for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Indirect damages</li>
            <li>Business losses</li>
            <li>Lost profits</li>
            <li>Decisions made using the Service</li>
          </ul>
          <p>Total liability shall not exceed the amount paid by user in last 3 months.</p>

          <h3 className="font-semibold">11. Termination</h3>
          <p>We may suspend or terminate accounts for violation of these Terms.</p>

          <h3 className="font-semibold">12. Governing Law</h3>
          <p>These Terms are governed by the laws of [Insert Jurisdiction].</p>

          <h3 className="font-semibold">13. Contact</h3>
          <p>Email: support@spearprotocol.com</p>
        </section>

        {/* 2️⃣ PRIVACY POLICY */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif">2️⃣ PRIVACY POLICY (MANDATORY)</h2>

          <p><strong>Effective Date:</strong> 2/3/2026</p>

          <h3 className="font-semibold">1. Information Collected</h3>
          <p>Personal Data</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email</li>
            <li>Payment information (processed externally)</li>
          </ul>

          <h3 className="font-semibold">2. Purpose of Processing</h3>
          <p>We process data to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide platform access</li>
            <li>Process payments</li>
            <li>Maintain security</li>
            <li>Improve service</li>
            <li>Comply with law</li>
          </ul>

          <h3 className="font-semibold">3. Legal Basis (GDPR)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Contract performance</li>
            <li>User consent</li>
            <li>Legitimate interest</li>
            <li>Legal compliance</li>
          </ul>

          <h3 className="font-semibold">4. Data Sharing</h3>
          <p>We may share data with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Payment processors</li>
            <li>Hosting providers</li>
            <li>Analytics tools</li>
          </ul>
          <p>We DO NOT sell personal data.</p>

          <h3 className="font-semibold">5. Data Retention</h3>
          <table className="w-full border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Data Type</th>
                <th className="border px-3 py-2">Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">Account Data</td>
                <td className="border px-3 py-2">Until deletion</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Logs</td>
                <td className="border px-3 py-2">90 days</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Financial Records</td>
                <td className="border px-3 py-2">As required by law</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Deleted Accounts</td>
                <td className="border px-3 py-2">Removed within 30 days</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-semibold">6. User Rights</h3>
          <p>Users may:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access their data</li>
            <li>Correct data</li>
            <li>Request deletion</li>
            <li>Withdraw consent</li>
            <li>Request portability (where applicable)</li>
          </ul>
          <p>Requests: support@spearprotocol.com</p>

          <h3 className="font-semibold">7. Security Measures</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>TLS/HTTPS encryption</li>
            <li>Access controls</li>
            <li>Limited data access</li>
          </ul>

          <h3 className="font-semibold">8. International Transfers</h3>
          <p>Data may be transferred internationally with safeguards.</p>

          <h3 className="font-semibold">9. Children</h3>
          <p>Not intended for users under 18.</p>
        </section>

        {/* Remaining Sections */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif">4️⃣ BILLING & REFUND POLICY</h2>

          <h3 className="font-semibold">Billing</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Subscription-based access.</li>
            <li>Charges processed securely.</li>
            <li>Auto-renewal applies unless cancelled.</li>
          </ul>

          <h3 className="font-semibold">Cancellation</h3>
          <p>Users may cancel anytime via account settings.</p>
          <p>Access remains until end of billing cycle.</p>

          <h3 className="font-semibold">Refunds</h3>
          <p>Refunds not guaranteed unless required by consumer law.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif">5️⃣ DATA PROTECTION & SECURITY POLICY</h2>
          <p>SPEAR Protocol implements:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Encrypted data transmission</li>
            <li>Secure hosting infrastructure</li>
            <li>Restricted administrative access</li>
            <li>Activity logging</li>
            <li>Periodic vulnerability review</li>
          </ul>
          <p>In case of a data breach:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users will be notified within legally mandated timeframes (e.g., 72 hours under GDPR).</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif">6️⃣ DISCLAIMER PAGE (MANDATORY FOR RISK MITIGATION)</h2>
          <p>SPEAR Protocol is a structured analytical framework.</p>
          <p>It does NOT:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide financial advice</li>
            <li>Provide legal advice</li>
            <li>Provide medical advice</li>
            <li>Act as a fiduciary</li>
          </ul>
          <p>All decisions are solely the user’s responsibility.</p>
          <p>No guarantees of performance or outcome are provided.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif">7️⃣ ACCESSIBILITY STATEMENT</h2>
          <p>We aim to comply with WCAG 2.1 standards.</p>
          <p>If you experience accessibility barriers, contact: [Insert Email]</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif">8️⃣ INDIA DPDP ACT (2023) ADDITION – IF SERVING INDIA</h2>
          <p><strong>Grievance Officer</strong></p>
          <p>Email: support@spearprotocol.com</p>
          <p>Response timeline: Within 7–15 days.</p>
          <p>Users may escalate unresolved complaints under applicable law.</p>
        </section>

      </div>
    </main>
  )
}