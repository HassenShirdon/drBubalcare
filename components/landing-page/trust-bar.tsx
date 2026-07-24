import { Shield, Award, Clock } from "lucide-react";

export function TrustBar() {
  return (
    <div className="bg-clinical-navy text-white text-xs py-1.5 hidden md:block">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          HIPAA Compliant
        </span>
        <span className="flex items-center gap-1.5">
          <Award className="w-3 h-3" />
          Board-Certified Specialists
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          24-48h Turnaround
        </span>
      </div>
    </div>
  );
}
