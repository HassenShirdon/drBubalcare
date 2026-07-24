"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "./data";

export function MiniFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQ.map((item, i) => (
        <div
          key={i}
          className="border border-surface-gray rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="font-headline-md text-sm font-semibold text-clinical-navy">
              {item.question}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4">
              <p className="font-body-md text-sm text-on-surface-variant">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}