"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "./data";

export function MiniFaq() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
      <div className="space-y-3">
      {FAQ.map((item) => {
        const isOpen = openQuestion === item.question;
        return (
          <div
            key={item.question}
            className="border border-[#E2E8F0] rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenQuestion(isOpen ? null : item.question)}
              className="w-full flex items-center justify-between p-4 text-left gap-3"
            >
              <span className="text-base font-semibold text-[#1E3A5F]">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#64748B] transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen
              ? (
                <div className="px-4 pb-4">
                  <p className="text-base text-[#64748B]">
                    {item.answer}
                  </p>
                </div>
              )
              : null}
          </div>
        );
      })}
    </div>
  );
}