import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
    <div className="min-h-screen bg-[#FAF7F0] text-[#071426] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E6DFCE] text-xs font-mono text-[#071426] mb-3 font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" /> Candidate Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#071426] font-['Outfit']">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#4A5568] max-w-xl mx-auto">
            Everything you need to know about the 31-day AI engineering interview evaluation engine.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="card-surface rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-base font-bold text-[#071426] font-['Outfit']">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#071426] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#C9A96E]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#4A5568] leading-relaxed border-t border-[#EFE9DC] pt-3 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="card-surface rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#071426] font-['Outfit']">
            Ready to test your technical depth?
          </h2>
          <div className="pt-2 flex justify-center">
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
