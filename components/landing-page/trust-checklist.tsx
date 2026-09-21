import { CheckCircle2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Encrypted uploads and signed file URLs",
  "Every opinion comes from a board-certified physician in our Global Doctors Network",
  "No hidden fees. Prices shown upfront",
  "Opinion delivered in 24-48 hours",
  "Peer review available on request",
];

export function TrustChecklist() {
  return (
    <div className="card-hairline rounded-2xl p-6 md:p-8">
      <h3 className="text-lg font-semibold text-landing-text mb-5">
        What you can expect
      </h3>
      <ul className="space-y-4">
        {CHECKLIST_ITEMS.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-base text-landing-text-muted"
          >
            <CheckCircle2
              className="w-5 h-5 text-landing-accent flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
