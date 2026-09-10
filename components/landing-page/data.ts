import {
  Activity,
  Apple,
  Award,
  BadgeCheck,
  Baby,
  Car,
  ClipboardList,
  Clock,
  Droplets,
  Eye,
  FileText,
  FlaskConical,
  Heart,
  MessageSquareText,
  Microscope,
  Ribbon,
  ScanLine,
  Shield,
  Stethoscope,
  Sun,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export const SPECIALIZATIONS: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Hematopathology",
    description:
      "Blood disorders, bone marrow biopsies, and hematologic malignancies reviewed by subspecialists from our Global Doctors Network.",
    icon: Droplets,
  },
  {
    title: "Clinical Pathology",
    description:
      "Lab medicine, biochemical analysis, and diagnostic chemistry interpretation.",
    icon: FlaskConical,
  },
  {
    title: "Diagnostic Radiology",
    description:
      "X-rays, CT scans, MRIs, and ultrasounds interpreted by board-certified radiologists.",
    icon: ScanLine,
  },
  {
    title: "Cytopathology",
    description:
      "Fine needle aspirates, Pap smears, and fluid cytology analyzed by cytopathology experts.",
    icon: Microscope,
  },
  {
    title: "Dermatopathology",
    description:
      "Skin biopsies, lesion specimens, and melanoma screening reviewed by dermatopathologists from our Global Doctors Network.",
    icon: Sun,
  },
  {
    title: "Women's Health",
    description:
      "Gynecological pathology, breast biopsies, and fertility-related diagnostic interpretations.",
    icon: Heart,
  },
  {
    title: "Fetal Medicine",
    description:
      "Prenatal screening, fetal anomaly assessment, and maternal-fetal diagnostic review.",
    icon: Baby,
  },
  {
    title: "Pediatrics",
    description:
      "Childhood disease diagnostics, neonatal screening, and pediatric pathology review.",
    icon: Stethoscope,
  },
  {
    title: "Oncology",
    description:
      "Cancer pathology, tumor grading, and molecular marker interpretation by oncology experts.",
    icon: Ribbon,
  },
  {
    title: "Chronic Disease",
    description:
      "Diabetes, hypertension, and long-term condition monitoring under the ongoing oversight of physicians in our Global Doctors Network.",
    icon: Activity,
  },
] as const;

export const TRUST_POINTS: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "The Global Doctors Network standard",
    description:
      "Every physician in our Global Doctors Network is credential-verified and board-certified before joining. No exceptions.",
    icon: BadgeCheck,
  },
  {
    title: "Your data stays private",
    description:
      "HIPAA and GDPR compliant. Files encrypted end-to-end. AI never sees your name.",
    icon: Shield,
  },
  {
    title: "Plain-language reports",
    description:
      "No medical jargon. Your report is written as if by a trusted GP, with a plain-language summary included.",
    icon: MessageSquareText,
  },
  {
    title: "24-48 hour turnaround",
    description:
      "Most cases reviewed within 2 days. Urgent cases flagged and prioritized.",
    icon: Clock,
  },
] as const;

export const STATS: { value: string; label: string }[] = [
  { value: "10+", label: "Medical Disciplines" },
  { value: "24-48h", label: "Average Turnaround" },
  { value: "Encrypted", label: "Data Security" },
  { value: "East Africa", label: "Primary Coverage" },
];

export const STEPS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: FileText,
    title: "Upload your records",
    description:
      "Lab reports, scans, slides - upload anything. Takes under 5 minutes from your phone.",
  },
  {
    icon: Users,
    title: "Matched with the right expert",
    description:
      "Our system reviews your case and matches you with a physician in our Global Doctors Network who specializes in your exact condition.",
  },
  {
    icon: Microscope,
    title: "Your case is expertly reviewed",
    description:
      "A board-certified physician from our Global Doctors Network reviews your materials alongside an AI pre-screen. Target: 24-48 hours.",
  },
  {
    icon: ClipboardList,
    title: "Clear answers delivered",
    description:
      "Receive a structured written opinion with a plain-language summary. No jargon, no confusion.",
  },
] as const;

export const SERVICES: {
  title: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  highlights: string[];
  link: string;
}[] = [
  {
    title: "Medical Second Opinion Center",
    shortDescription:
      "Receive an independent review of your diagnosis, treatment plan, laboratory results, medical imaging, and physician recommendations.",
    description:
      "Receive an independent review of your diagnosis, treatment plan, and physician recommendations from board-certified doctors in our Global Doctors Network.",
    icon: Stethoscope,
    highlights: [
      "Treatment Review",
      "Diagnosis Verification",
      "Medication Review",
      "Surgery Review",
      "Chronic Disease Management",
      "Cancer Second Opinions",
    ],
    link: "/services/medical-second-opinion",
  },
  {
    title: "Laboratory & Diagnostic Center",
    shortDescription:
      "Professional interpretation of laboratory tests and diagnostic imaging to help patients understand their health.",
    description:
      "Professional interpretation of laboratory tests and diagnostic imaging to help patients understand their health.",
    icon: Microscope,
    highlights: [
      "Laboratory Interpretation",
      "MRI Review",
      "CT Scan Review",
      "ECG Interpretation",
      "Disease Monitoring",
      "Risk Assessment",
    ],
    link: "/services/laboratory-diagnostic-center",
  },
  {
    title: "Medical Nutrition Therapy Center",
    shortDescription:
      "Personalized nutrition therapy designed to prevent disease and improve long-term health outcomes.",
    description:
      "Personalized nutrition therapy designed to prevent disease and improve long-term health outcomes.",
    icon: Apple,
    highlights: [
      "Diabetes Nutrition",
      "Kidney Nutrition",
      "Pregnancy Nutrition",
      "Weight Management",
      "Child Nutrition",
      "Micronutrients",
    ],
    link: "/services/medical-nutrition-therapy",
  },
  {
    title: "Child Health & Development Center",
    shortDescription:
      "Supporting healthy growth and development from pregnancy through adolescence.",
    description:
      "Supporting healthy growth and development from pregnancy through adolescence.",
    icon: Baby,
    highlights: [
      "Pregnancy",
      "Breastfeeding",
      "Child Nutrition",
      "Growth Monitoring",
      "Vaccination",
      "Development",
    ],
    link: "/services/child-health-development",
  },
  {
    title: "Women's Health & Fertility Center",
    shortDescription:
      "Evidence-based reproductive health guidance, fertility education, pregnancy planning, and women's wellness.",
    description:
      "Evidence-based reproductive health guidance, fertility education, pregnancy planning, and women's wellness.",
    icon: Heart,
    highlights: [
      "Infertility",
      "PCOS",
      "Ovulation",
      "Pregnancy Planning",
      "IVF Education",
      "Fertility Nutrition",
    ],
    link: "/services/womens-health-fertility",
  },
] as const;

export const TESTIMONIALS: {
  quote: string;
  name: string;
  location: string;
  rating: number;
}[] = [
  {
    quote:
      "I uploaded my lab results on Monday morning and had an expert opinion from the Global Doctors Network by Tuesday evening. For the first time, I understood my condition.",
    name: "Sarah M.",
    location: "Nairobi, Kenya",
    rating: 5,
  },
  {
    quote:
      "My local doctor was not sure about my biopsy. Dr. Bubal Care connected me to a pathologist who gave me a clear answer in 36 hours.",
    name: "James K.",
    location: "Kampala, Uganda",
    rating: 5,
  },
  {
    quote:
      "The plain-language summary was the best part. No medical jargon - just clear answers I could share with my family.",
    name: "Amina H.",
    location: "Dar es Salaam, Tanzania",
    rating: 5,
  },
] as const;

export const SPECIALISTS: { name: string; specialty: string }[] = [
  { name: "Dr. A. Mensah", specialty: "Hematopathologist" },
  { name: "Dr. K. Okafor", specialty: "Diagnostic Radiologist" },
  { name: "Dr. P. Njeri", specialty: "Cytopathologist" },
  { name: "Dr. S. Abebe", specialty: "Dermatopathologist" },
  { name: "Dr. L. Mwangi", specialty: "Oncologist" },
] as const;

export const FAQ: { question: string; answer: string }[] = [
  {
    question: "How much does it cost?",
    answer:
      "Pricing varies by service. Most expert opinions from our Global Doctors Network start from $49.",
  },
  {
    question: "What files can I upload?",
    answer:
      "Lab reports, DICOM scans, histology slides, photos - we accept all common formats.",
  },
  {
    question: "How long does it take?",
    answer:
      "Most cases are completed within 24-48 hours. Urgent cases are flagged and prioritized.",
  },
  {
    question: "Are the doctors qualified?",
    answer:
      "Every doctor in our Global Doctors Network is board-certified and credential-verified before joining the network.",
  },
  {
    question: "What if I do not understand my report?",
    answer: "Every report includes a plain-language summary. You can also ask follow-up questions via our AI assistant or book a live consultation.",
  },
];

export const PROBLEMS: {
  icon: LucideIcon;
  stat: string;
  label: string;
  description: string;
}[] = [
  {
    icon: Users,
    stat: "1",
    label: "per 100,000+",
    description:
      "On average, parts of East Africa have just one specialist for every 100,000 patients. Most hospitals lack a single board-certified pathologist or radiologist on staff - which is exactly the gap our Global Doctors Network was built to close.",
  },
  {
    icon: Car,
    stat: "6-8",
    label: "hours travel",
    description:
      "Average travel time to reach the nearest major clinic. Patients and families travel for hours - sometimes across borders - just for a second opinion.",
  },
  {
    icon: Clock,
    stat: "Weeks",
    label: "to months",
    description:
      "Waiting time for an appointment in many regions. By the time your results reach a qualified physician, critical time for early detection has been lost.",
  },
] as const;
