import { Shield, Award, Clock } from "lucide-react";

export function TrustBar() {
  return (
    <div className="bg-landing-brand text-white text-xs py-1.5 hidden md:block">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-center gap-8">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-white/60" aria-hidden="true" />
          HIPAA Compliant
        </span>
        <span className="flex items-center gap-1.5">
          <Award className="w-3 h-3 text-white/60" aria-hidden="true" />
          Global Doctors Network
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-white/60" aria-hidden="true" />
          24-48h Turnaround
        </span>
      </div>
    </div>
  );
}
