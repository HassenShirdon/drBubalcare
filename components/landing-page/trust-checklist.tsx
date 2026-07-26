import { CheckCircle2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Encrypted uploads and signed file URLs",
  "Board-certified specialists only",
  "No hidden fees — prices shown upfront",
  "Opinion delivered in 24–48 hours",
  "Peer review available on request",
];

export function TrustChecklist() {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-surface-gray shadow-sm">
      <h3 className="font-headline-md text-lg font-semibold text-text-medical-black mb-5">
        What you can expect
      </h3>
      <ul className="space-y-4">
        {CHECKLIST_ITEMS.map((item) => (
          <li key={item} className="flex items-start gap-3 text-base text-on-surface-variant">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}