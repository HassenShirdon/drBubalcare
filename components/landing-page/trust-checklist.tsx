import { CheckCircle2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Encrypted uploads",
  "Board-certified only",
  "No hidden fees",
  "24-48h guarantee",
  "Peer review available",
];

export function TrustChecklist() {
  return (
    <div className="space-y-3">
      {CHECKLIST_ITEMS.map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-sm text-on-surface-variant">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          {item}
        </div>
      ))}
    </div>
  );
}