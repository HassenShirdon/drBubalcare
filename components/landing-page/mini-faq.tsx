"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "./data";

export function MiniFaq() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {FAQ.map((item) => {
        const isOpen = openQuestion === item.question;
        return (
          <div
            key={item.question}
            className="border border-landing-border/60 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenQuestion(isOpen ? null : item.question)}
              className="w-full flex items-center justify-between p-4 text-left gap-3 hover:bg-landing-surface-muted/50 transition-colors"
            >
              <span className="text-sm font-semibold text-landing-text">
                {item.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-landing-text-faint transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen ? (
              <div className="px-4 pb-4">
                <p className="text-sm text-landing-text-muted leading-relaxed">
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
