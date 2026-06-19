import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import GuestPostsClient from "./GuestPostsClient";

export const metadata = {
  title: "Guest Post Marketplace | High DA Backlinks",
  description: "Boost your SEO with our high-quality guest posting services. Get do-follow backlinks on top tech and AI blogs.",
};

export default function GuestPostsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0F] pt-32 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-page relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Boost Your Rankings with <span className="gradient-text">Premium Guest Posts</span>
            </h1>
            <p className="text-lg text-slate-400">
              Get high-quality, contextual do-follow backlinks from authoritative tech and AI blogs. White-hat SEO services to grow your organic traffic.
            </p>
          </div>

          <GuestPostsClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
