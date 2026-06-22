import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | PakAiVerse",
  description: "Terms of Service for PakAiVerse — Read our terms and conditions before using our services.",
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] pt-32 pb-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-brand-primary hover:underline text-sm mb-8 block">← Back to Home</Link>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-12">Last updated: June 2025</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the website <strong className="text-white">pakaiverse.com</strong> and any services provided by <strong className="text-white">PakAiVerse</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Services Offered</h2>
            <p>PakAiVerse provides the following services:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li><strong className="text-white">Web & App Development:</strong> Custom websites, SaaS platforms, and AI-powered applications.</li>
              <li><strong className="text-white">Guest Post / GBOB Services:</strong> Publishing high-quality guest posts on our platform (pakaiverse.com) to build backlinks, brand authority, and SEO rankings for clients.</li>
              <li><strong className="text-white">SEO & Content Services:</strong> Blog writing, keyword optimization, and digital marketing.</li>
              <li><strong className="text-white">AI Integration:</strong> Integrating AI agents, chatbots, and automation into business workflows.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Guest Post / GBOB Service Terms</h2>

            <h3 className="text-lg font-semibold text-slate-200 mt-5 mb-2">3.1 Client Responsibilities</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>You must provide accurate information including your website URL, target keyword, and contact details.</li>
              <li>Content submitted must be original, non-plagiarized, and must not violate any third-party intellectual property rights.</li>
              <li>Content must not promote illegal activities, hate speech, adult content, or misleading claims.</li>
              <li>You are responsible for the accuracy of all information provided about your business or website.</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-200 mt-5 mb-2">3.2 Our Responsibilities</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>We will publish your guest post on pakaiverse.com within the agreed timeframe after payment confirmation.</li>
              <li>Published posts will remain live for the duration agreed in your selected package.</li>
              <li>We reserve the right to edit posts for grammar, formatting, or to comply with our content guidelines without altering the core message.</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-200 mt-5 mb-2">3.3 Payment Terms</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>All payments must be made in full before work begins.</li>
              <li>We accept bank transfers and mobile payment methods (JazzCash, EasyPaisa) as shown on the checkout page.</li>
              <li>After payment, you must upload your payment receipt/screenshot through our Client Portal.</li>
              <li>Orders will be activated only after payment verification by our team.</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-200 mt-5 mb-2">3.4 Refund Policy</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Refunds are available within 48 hours of payment if work has not yet begun.</li>
              <li>Once a guest post is published, no refund will be issued.</li>
              <li>If we are unable to fulfill your order, a full refund will be issued within 7 business days.</li>
              <li>Refund requests must be sent to <a href="mailto:contact@pakaiverse.com" className="text-brand-primary hover:underline">contact@pakaiverse.com</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Client Portal & Account</h2>
            <p>
              Clients may create an account via Google Sign-In to track their orders. You are responsible for maintaining the confidentiality of your Google account credentials. We are not liable for any unauthorized access to your account resulting from your failure to secure your credentials.
            </p>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>
              All content on pakaiverse.com, including logos, designs, code, and written content, is the intellectual property of PakAiVerse unless otherwise stated. You may not copy, reproduce, or redistribute our content without written permission.
            </p>
            <p className="mt-3">
              For guest posts, the client retains ownership of the content they provide. By submitting content, you grant PakAiVerse a non-exclusive license to publish and display it on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              PakAiVerse shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services, including but not limited to loss of revenue, rankings, or business opportunities. Our total liability for any claim related to our services shall not exceed the amount paid for that specific service.
            </p>
            <p className="mt-3">
              We do not guarantee specific SEO results, ranking improvements, or traffic increases from our guest post services, as these are subject to search engine algorithms beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Prohibited Uses</h2>
            <p>You may not use our services to:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Promote illegal, harmful, or fraudulent activities.</li>
              <li>Publish spam, malware, or phishing content.</li>
              <li>Violate the intellectual property rights of others.</li>
              <li>Circumvent payment through fraudulent proof submissions.</li>
              <li>Attempt to gain unauthorized access to our systems or databases.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Third-Party Services</h2>
            <p>
              Our platform uses third-party services including Google OAuth, Cloudinary, Neon DB, and Vercel. Your use of these services is subject to their respective terms and privacy policies. We are not responsible for the practices of these third-party providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Modifications to Terms</h2>
            <p>
              We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable international commercial law. Any disputes shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes may be subject to binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact Us</h2>
            <p>For any questions regarding these Terms of Service:</p>
            <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-5 space-y-2 text-sm">
              <p><strong className="text-white">PakAiVerse</strong></p>
              <p>Email: <a href="mailto:contact@pakaiverse.com" className="text-brand-primary hover:underline">contact@pakaiverse.com</a></p>
              <p>Website: <a href="https://pakaiverse.com" className="text-brand-primary hover:underline">pakaiverse.com</a></p>
            </div>
          </section>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-6 text-sm text-slate-400">
            <Link href="/privacy" className="text-brand-primary hover:underline">← Privacy Policy</Link>
            <Link href="/guest-posts" className="hover:text-white transition">View Guest Post Packages</Link>
            <Link href="/" className="hover:text-white transition">Back to Home</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
