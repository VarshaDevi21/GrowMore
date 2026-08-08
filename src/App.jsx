import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import ProductStats from "./components/home/ProductStats";
import Features from "./components/home/Features";
import HowItWorksPreview from "./components/home/HowItWorksPreview";
import RoadmapPreview from "./components/home/RoadmapPreview";
import InterviewPreview from "./components/home/InterviewPreview";

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#071426] text-[#FFFDF7]">
      <Navbar />

      <main>
        <Hero />
        <ProductStats />
        <Features />
        <HowItWorksPreview />
        <RoadmapPreview />
        <InterviewPreview />

        {/* Final CTA */}
        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-[#C9A96E]/20 bg-[#0B1F3A] px-6 py-16 text-center sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A96E]">
              Ready?
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Ready to test what you actually learned?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8B93A1] sm:text-base">
              Step into an adaptive technical interview built around your own
              learning journey.
            </p>

            <a
              href="#interview"
              className="mt-8 inline-flex rounded-2xl bg-[#F7F1E3] px-6 py-3.5 text-sm font-bold text-[#071426] transition hover:bg-[#C9A96E]"
            >
              Start Your Interview
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">AI Interview Agent</p>
            <p className="mt-1 text-xs text-[#8B93A1]">
              Your learning journey. Your technical interview.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-[#8B93A1]">
            <a href="#home" className="hover:text-white">
              Home
            </a>

            <a href="#how-it-works" className="hover:text-white">
              How It Works
            </a>

            <a href="#roadmap" className="hover:text-white">
              Roadmap
            </a>

            <a href="#interview" className="hover:text-white">
              Interview
            </a>

            <span>Privacy</span>
            <span>Terms</span>
          </div>

          <p className="text-xs text-[#6F7887]">
            © 2026 AI Interview Agent
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;