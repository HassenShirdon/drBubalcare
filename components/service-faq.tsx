"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ServiceFAQ({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="border border-landing-border/60 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left gap-3 hover:bg-landing-surface-muted/50 transition-colors"
            >
              <span className="text-base font-semibold text-landing-text pr-8">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-landing-text-faint transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen ? (
              <div className="px-5 pb-5">
                <p className="text-base text-landing-text-muted leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
