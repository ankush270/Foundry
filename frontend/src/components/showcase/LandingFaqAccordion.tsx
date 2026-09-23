"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is Foundry and how does it combine YC, Product Hunt & GitHub data?",
    answer:
      "Foundry is a unified Tech Intelligence Platform indexing Y Combinator startups, daily Product Hunt launches, and open-source GitHub repositories into a single searchable research engine.",
  },
  {
    question: "How does the AI SaaS Clone & Blueprint Generator work?",
    answer:
      "Our AI analyzes any startup or launch to generate a complete technical blueprint — including recommended architecture, database schema, required APIs, and execution steps.",
  },
  {
    question: "Is Foundry free to use for founders and developers?",
    answer:
      "Yes! Foundry provides free access to search, filter, and analyze all 3,400+ YC startups, Product Hunt launch feeds, and GitHub open-source repositories.",
  },
  {
    question: "How often is the startup and product launch data updated?",
    answer:
      "Data is synchronized daily. Product Hunt upvotes and GitHub repository stars & velocity metrics are refreshed continuously.",
  },
  {
    question: "Can I compare multiple startups or tech stacks side-by-side?",
    answer:
      "Yes! Use our 3-Way Comparison Engine (/compare) to benchmark up to 3 startups or products side-by-side.",
  },
];

export default function LandingFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 doodle-card p-5 sm:p-6 bg-[#FAF8F5] dark:bg-[#111827]">
      <div className="flex items-center justify-between border-b-2 border-dashed border-[#263D5B]/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B] flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="doodle-font font-black text-xl text-[#263D5B] dark:text-[#49B6E5]">
            Frequently Asked Questions
          </h2>
        </div>
        <span className="doodle-badge text-[10px] bg-white text-[#263D5B] dark:bg-[#1F2937] dark:text-[#49B6E5]">
          Quick Reference
        </span>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`doodle-card transition-all overflow-hidden ${
                isOpen
                  ? "bg-white dark:bg-[#1F2937] border-2 border-[#49B6E5] shadow-[3px_3px_0px_0px_#49B6E5]"
                  : "bg-white/90 dark:bg-[#1F2937]/80"
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-4 py-3 flex items-center justify-between text-left gap-3 select-none"
              >
                <span className="doodle-font font-extrabold text-sm text-[#263D5B] dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#49B6E5] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-3 pt-1 text-xs text-[var(--muted)] leading-relaxed border-t-2 border-dashed border-[#263D5B]/15">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
