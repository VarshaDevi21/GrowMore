import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Cpu,
  Layers,
  Award,
  ChevronDown,
  HelpCircle,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const howItWorksSteps = [
    {
      number: '01',
      title: 'Connect 31-Day Journey',
      subtitle: 'Curriculum & Telemetry Sync',
      description:
        'The agent syncs candidate completed missions, commit history, and applied milestone days from Day 1 to Day 31.',
      icon: <Layers className="w-5 h-5 text-[#C9A96E]" />,
    },
    {
      number: '02',
      title: 'AI Builds Technical Plan',
      subtitle: 'Targeted Question Blueprint',
      description:
        'The system constructs 10 targeted evaluation probes matching only the concepts and tools the candidate actually encountered.',
      icon: <Cpu className="w-5 h-5 text-[#071426]" />,
    },
    {
      number: '03',
      title: 'Live 20-Minute Interview',
      subtitle: 'Real-Time Depth Probing',
      description:
        'Candidates enter a focused interview sandbox. Questions scale in real time based on demonstrated mastery and domain accuracy.',
      icon: <Bot className="w-5 h-5 text-[#C9A96E]" />,
    },
    {
      number: '04',
      title: 'Diagnostic Report',
      subtitle: 'Curriculum-Linked Feedback',
      description:
        'Receive actionable evaluation metrics across 5 dimensions, identifying demonstrated strengths and specific curriculum days to review.',
      icon: <Award className="w-5 h-5 text-[#071426]" />,
    },
  ];

  const faqs = [
    {
      q: 'How does the AI Interview Agent adapt difficulty during the session?',
      a: 'The agent analyzes technical accuracy, domain terminology, and system trade-offs in your response. If you clearly articulate concepts (like HNSW indexing or async MCP tool execution), difficulty scales up to senior/principal architectural edge cases. If hesitation is detected, the agent drops to foundational diagnostic questions.',
    },
    {
      q: 'Is the interview based on real 31-day curriculum topics?',
      a: 'Yes. The interview is 100% mapped to your actual 31-day curriculum journey (from Day 1 Python setup, Day 7 Embeddings, Day 10 Retrieval, to Day 23 MCP and Day 31 Capstone). It tests only the applied technologies you configured and built.',
    },
    {
      q: 'What happens during the 20-minute live interview environment?',
      a: 'You enter a controlled, distraction-free interview session with 10 sequential questions. The AI avatar provides dynamic state feedback (speaking, listening, thinking), tracks elapsed time, and evaluates your architectural responses.',
    },
    {
      q: 'How do candidates access their sessions?',
      a: 'Click "Get Started" or "Start Interview" to navigate to the candidate selection screen. Select or search any of the 20 cohort candidates from candidates.json to unlock your synced dashboard, roadmap, and launch your session.',
    },
    {
      q: 'What does the final diagnostic report include?',
      a: 'The final report provides scores across 5 core evaluation dimensions, identifies demonstrated strengths and skill gaps, and links recommended next steps directly to specific curriculum days (e.g. Day 10 Retrieval or Day 27 Security Guardrails).',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-cream-grid bg-cream-radial">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Copy */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2D9C8] shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span className="text-xs font-bold text-[#050E1A] font-mono">
                    #ABTalks Edition · 31-Day AI Cohort Technical Evaluation
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#050E1A] leading-[1.1] font-['Outfit']">
                  Your Learning Journey.{' '}
                  <span className="block mt-2 text-[#050E1A] font-extrabold text-4xl sm:text-5xl md:text-6xl font-['Outfit']">
                    Your Technical Interview.
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-[#1E293B] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  An adaptive AI interviewer that understands what you built, challenges your technical
                  depth in real time, and gives you actionable feedback grounded in your 31-day curriculum.
                </p>

                {/* Hero Buttons: Get Started & Start Interview both go to /login */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-xl shadow-[#071426]/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
                  </Link>

                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm text-[#050E1A] bg-[#FFFFFF] hover:bg-[#F3EEE3] border border-[#E2D9C8] shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <PlayCircle className="w-4 h-4 text-[#050E1A]" />
                    <span>Start Interview</span>
                  </Link>
                </div>

                {/* Key Value Badges */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-[#334155]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    <span>10 Adaptive Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    <span>31-Day Curriculum Grounded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    <span>20 Cohort Candidates</span>
                  </div>
                </div>
              </div>

              {/* Right Visual Card: Clean White Surface + Bold Accents */}
              <div className="lg:col-span-5 relative">
                <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E2D9C8]">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DC]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#071426] flex items-center justify-center shadow-sm">
                        <Bot className="w-5 h-5 text-[#FFFDF7]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#050E1A]">AI Interview Agent</span>
                          <span className="text-[10px] font-mono uppercase bg-[#2E7D32]/15 text-[#2E7D32] px-2 py-0.5 rounded font-bold">
                            Adaptive
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-[#475569]">Cohort Evaluation Sandbox</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#050E1A] bg-[#FAF7F0] px-2.5 py-1 rounded-lg border border-[#E2D9C8]">
                      10 Questions
                    </span>
                  </div>

                  {/* Visual Content */}
                  <div className="py-5 space-y-3.5 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#050E1A] font-extrabold">Curriculum Grounding</span>
                        <span className="text-[#050E1A] font-bold bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E2D9C8]">
                          Day 1 → Day 31
                        </span>
                      </div>
                      <p className="text-xs text-[#1E293B] font-medium leading-relaxed">
                        Questions specifically evaluate tools and architectures configured across your cohort missions.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#050E1A] font-extrabold">Real-Time Scaling</span>
                        <span className="text-[#2E7D32] font-bold bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E2D9C8]">
                          Dynamic Difficulty
                        </span>
                      </div>
                      <p className="text-xs text-[#1E293B] font-medium leading-relaxed">
                        Technical depth probing adjusts subsequent questions between Foundational, Applied, and Principal Architect tiers.
                      </p>
                    </div>
                  </div>

                  {/* Card Action */}
                  <Link
                    to="/login"
                    className="w-full py-3.5 rounded-xl bg-[#071426] hover:bg-[#16345C] text-xs font-mono font-bold text-[#FFFDF7] flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Launch Candidate Session</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A96E]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION — HORIZONTAL CARDS CONTAINER */}
        <section id="how-it-works" className="py-24 bg-[#FFFFFF] border-y-2 border-[#E2D9C8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border border-[#E2D9C8] text-xs font-mono text-[#050E1A] uppercase tracking-wider mb-3 font-bold shadow-sm">
                <Layers className="w-3.5 h-3.5 text-[#C9A96E]" /> 4-Step Technical Workflow
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#050E1A] font-['Outfit']">
                How It Works
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#1E293B] max-w-xl mx-auto font-medium">
                A seamless transition from verified curriculum learning to live adaptive technical interview and diagnostic feedback.
              </p>
            </div>

            {/* Horizontal Cards Container */}
            <div className="card-surface rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border-2 border-[#E2D9C8] bg-[#FAF7F0]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {howItWorksSteps.map((step, index) => (
                  <div
                    key={step.number}
                    className="relative rounded-2xl bg-[#FFFFFF] border border-[#E2D9C8] p-5 sm:p-6 flex flex-col justify-between hover:border-[#071426] transition-all shadow-sm group"
                  >
                    <div>
                      {/* Top Bar: Icon + Step Number */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-center shadow-sm group-hover:bg-[#071426] group-hover:text-[#FFFDF7] transition-all">
                          {step.icon}
                        </div>
                        <span className="text-xl font-black font-mono text-[#050E1A] bg-[#FAF7F0] px-2.5 py-1 rounded-lg border border-[#E2D9C8]">
                          {step.number}
                        </span>
                      </div>

                      {/* Subtitle & Title */}
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A96E] block mb-1 font-extrabold">
                        {step.subtitle}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#050E1A] mb-2 font-['Outfit']">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#1E293B] leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>

                    {/* Step Flow indicator */}
                    <div className="mt-4 pt-3 border-t border-[#EFE8DC] flex items-center justify-between text-[11px] font-mono text-[#475569]">
                      <span className="font-bold">Stage {index + 1} of 4</span>
                      {index < 3 ? (
                        <ArrowRight className="w-3.5 h-3.5 text-[#C9A96E] hidden lg:block" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 bg-[#FAF7F0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2D9C8] text-xs font-mono text-[#050E1A] uppercase tracking-wider mb-3 font-bold shadow-sm">
                <HelpCircle className="w-3.5 h-3.5 text-[#C9A96E]" /> Frequently Asked Questions
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#050E1A] font-['Outfit']">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#1E293B] max-w-xl mx-auto font-medium">
                Everything you need to know about candidate selection, adaptive scoring, and the 31-day journey.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="card-surface rounded-2xl overflow-hidden transition-all shadow-sm border border-[#E2D9C8]"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="text-sm font-bold text-[#050E1A] font-['Outfit']">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#050E1A] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#C9A96E]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-[#1E293B] leading-relaxed border-t border-[#EFE8DC] pt-3 font-medium">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Landing;
