import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | PakAiVerse",
  description: "Privacy Policy for PakAiVerse — Learn how we collect, use, and protect your personal information.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] pt-32 pb-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-brand-primary hover:underline text-sm mb-8 block">← Back to Home</Link>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-12">Last updated: June 2025</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
            Welcome to <strong className="text-white">PakAiVerse</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We are a full-stack AI development agency offering web development, SaaS solutions, AI integration, and Guest Post / GBOB (Guest Blogging Outreach Business) services to clients worldwide.
            </p>
            <p className="mt-3">
              This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website at <strong className="text-white">pakaiverse.com</strong> or use any of our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li><strong className="text-white">Contact Information:</strong> Name, email address, phone number — collected when you submit a contact form, inquiry, or place an order.</li>
              <li><strong className="text-white">Order Details:</strong> Website URL, target keywords, selected package — collected when you place a Guest Post order.</li>
              <li><strong className="text-white">Google Account Data:</strong> If you sign in with Google, we receive your name, email, and profile picture from Google OAuth 2.0. We do not store your Google password.</li>
              <li><strong className="text-white">Payment Proof:</strong> When you submit a payment receipt, the uploaded image/file is stored securely via Cloudinary.</li>
              <li><strong className="text-white">Usage Data:</strong> Standard web analytics data (page views, browser type, IP address) may be collected via third-party tools.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Process and fulfill your Guest Post / service orders.</li>
              <li>Communicate order updates, payment confirmations, and project status.</li>
              <li>Send relevant service updates, promotions, or newsletters (you can opt out at any time).</li>
              <li>Improve our website, services, and user experience.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Google OAuth (Sign in with Google)</h2>
            <p>
              We use Google OAuth 2.0 to allow clients to sign in securely. When you sign in with Google:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>We receive your <strong className="text-white">name, email address, and profile picture</strong> from Google.</li>
              <li>We use this information to identify you and connect you to your orders.</li>
              <li>We <strong className="text-white">do not</strong> access your Google Drive, Gmail, contacts, or any other Google data.</li>
              <li>We <strong className="text-white">do not</strong> store your Google password.</li>
              <li>You can revoke access at any time from your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="text-brand-primary hover:underline">Google Account settings</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Storage & Security</h2>
            <p>
              Your data is stored in a secure PostgreSQL database (Neon DB) with encrypted connections. Payment proof files are stored via Cloudinary with access controls. We take commercially reasonable steps to protect your data, but no transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Sharing</h2>
            <p>We <strong className="text-white">do not sell, trade, or rent</strong> your personal information to third parties. We may share data only with:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li><strong className="text-white">Service Providers:</strong> Cloudinary (file storage), Neon (database), Vercel (hosting) — solely for operating our services.</li>
              <li><strong className="text-white">Legal Requirements:</strong> If required by law, court order, or governmental authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cookies</h2>
            <p>
              Our website may use cookies for authentication (session management) and analytics. You can control cookies through your browser settings. Disabling cookies may affect the functionality of the Client Portal login.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Access to the personal data we hold about you.</li>
              <li>Correction of inaccurate data.</li>
              <li>Deletion of your data (subject to legal obligations).</li>
              <li>Withdrawal of consent at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, email us at <a href="mailto:contact@pakaiverse.com" className="text-brand-primary hover:underline">contact@pakaiverse.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed at children under 13. We do not knowingly collect personal data from children. If we discover that a child has provided us with personal information, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Your continued use of our services after changes constitutes your acceptance of the new policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-5 space-y-2 text-sm">
              <p><strong className="text-white">PakAiVerse</strong></p>
              <p>Email: <a href="mailto:contact@pakaiverse.com" className="text-brand-primary hover:underline">contact@pakaiverse.com</a></p>
              <p>Website: <a href="https://pakaiverse.com" className="text-brand-primary hover:underline">pakaiverse.com</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
