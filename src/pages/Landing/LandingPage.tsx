import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { HeroSection } from '../../components/home/HeroSection';
import { TrustStatsSection } from '../../components/home/TrustStatsSection';
import { FeaturesSection } from '../../components/home/FeaturesSection';
import { HowItWorksSection } from '../../components/home/HowItWorksSection';
import { RoadmapPreviewSection } from '../../components/home/RoadmapPreviewSection';
import { InterviewPreviewSection } from '../../components/home/InterviewPreviewSection';
import { CandidateProfilePreview } from '../../components/home/CandidateProfilePreview';
import { WhyDifferentSection } from '../../components/home/WhyDifferentSection';
import { FinalCtaSection } from '../../components/home/FinalCtaSection';
import { Footer } from '../../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#071426] text-[#FFFDF7] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Landing Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Trust / Product Stats Section */}
        <TrustStatsSection />

        {/* 3. Features Section */}
        <FeaturesSection />

        {/* 4. How It Works 4-Step Pipeline */}
        <HowItWorksSection />

        {/* 5. 31-Day Roadmap Preview (Actual Curriculum Data) */}
        <RoadmapPreviewSection />

        {/* 6. Mock Interactive Interview Interface */}
        <InterviewPreviewSection />

        {/* 7. Candidate Profile Sync Section */}
        <CandidateProfilePreview />

        {/* 8. Why This Is Different (Comparison Cards) */}
        <WhyDifferentSection />

        {/* 9. Final Call to Action */}
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
