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
            className="border border-surface-gray rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenQuestion(isOpen ? null : item.question)}
              className="w-full flex items-center justify-between p-4 text-left gap-3"
            >
              <span className="font-headline-md text-base font-semibold text-clinical-navy">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-on-surface-variant transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen
              ? (
                <div className="px-4 pb-4">
                  <p className="font-body-md text-base text-on-surface-variant">
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