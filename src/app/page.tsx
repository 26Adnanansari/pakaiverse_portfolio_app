import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import GoogleSignInInfo from "@/components/portfolio/GoogleSignInInfo";
import Projects from "@/components/portfolio/Projects";
import FeaturedSaaS from "@/components/portfolio/FeaturedSaaS";
import BentoServices from "@/components/portfolio/BentoServices";
import ProcessTimeline from "@/components/portfolio/ProcessTimeline";
import AboutFounder from "@/components/portfolio/AboutFounder";
import FunnelSection from "@/components/portfolio/FunnelSection";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import FloatingCTA from "@/components/portfolio/FloatingCTA";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";

export const revalidate = 60; // Revalidate home page every 60 seconds so dynamic projects appear

export default async function Home() {
  const dbProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <GoogleSignInInfo />
        <FeaturedSaaS />
        <Projects dbProjects={dbProjects} />
        <BentoServices />
        <ProcessTimeline />
        <AboutFounder />
        <FunnelSection />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
