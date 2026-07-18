import {
  Activity,
  Baby,
  BadgeCheck,
  ClipboardList,
  Clock,
  Droplets,
  FileText,
  FlaskConical,
  Heart,
  MessageSquareText,
  Microscope,
  Ribbon,
  ScanLine,
  Shield,
  Sun,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const SPECIALIZATIONS: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Hematopathology',
    description: 'Blood disorders, leukemia, lymphoma diagnosis',
    icon: Droplets,
  },
  {
    title: 'Clinical Pathology',
    description: 'Lab medicine, biochemical analysis, diagnostics',
    icon: FlaskConical,
  },
  {
    title: 'Diagnostic Radiology',
    description: 'X-ray, CT, MRI interpretation',
    icon: ScanLine,
  },
  {
    title: 'Fetal Medicine',
    description: 'Prenatal screening, fetal anomaly assessment',
    icon: Baby,
  },
  {
    title: 'Cytopathology',
    description: 'Cell-level analysis, fine needle aspirates',
    icon: Microscope,
  },
  {
    title: 'Dermatopathology',
    description: 'Skin biopsy analysis, melanoma screening',
    icon: Sun,
  },
  {
    title: "Women's Health",
    description: 'Gynecological pathology, fertility-related diagnostics',
    icon: Heart,
  },
  {
    title: 'Pediatrics',
    description: 'Childhood disease diagnostics, neonatal screening',
    icon: Users,
  },
  {
    title: 'Oncology',
    description: 'Cancer staging, tumor classification, treatment monitoring',
    icon: Ribbon,
  },
  {
    title: 'Chronic Disease',
    description: 'Diabetes, hypertension, long-term monitoring',
    icon: Activity,
  },
] as const;

export const TRUST_POINTS: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Board-certified specialists only',
    description: 'Every specialist is verified. No exceptions.',
    icon: BadgeCheck,
  },
  {
    title: 'Your data stays private',
    description: 'HIPAA and GDPR compliant. Files encrypted. AI never sees your name.',
    icon: Shield,
  },
  {
    title: 'Plain-language reports',
    description: 'No medical jargon. Your report is written as if by a trusted GP.',
    icon: MessageSquareText,
  },
  {
    title: '24-48 hour turnaround',
    description: 'Most cases reviewed within 2 days. Urgent cases get priority.',
    icon: Clock,
  },
] as const;

export const STATS: { value: string; label: string }[] = [
  { value: '10+', label: 'Specialist Disciplines' },
  { value: '24-48h', label: 'Average Turnaround' },
  { value: 'Encrypted', label: 'Data Security' },
  { value: 'East Africa', label: 'Primary Coverage' },
] as const;

export const STEPS: { num: string; title: string; description: string }[] = [
  {
    num: '01',
    title: 'Upload your records',
    description:
      'Lab reports, scans, slides — upload anything. Takes under 5 minutes.',
  },
  {
    num: '02',
    title: 'AI matches your specialist',
    description:
      'Our system reviews your case and routes it to the right board-certified specialist.',
  },
  {
    num: '03',
    title: 'Specialist reviews',
    description:
      'A qualified specialist reviews your materials alongside an AI pre-screen. Target: 24-48 hours.',
  },
  {
    num: '04',
    title: 'Clear answers delivered',
    description:
      'You receive a structured report with a plain-language summary. No jargon.',
  },
] as const;

export const SERVICES: {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
}[] = [
  {
    title: 'Specialist Opinions',
    description:
      'Submit your records — slides, scans, or lab reports — and receive a written opinion from a board-certified specialist within 24-48 hours.',
    icon: FileText,
    category: 'Opinion',
  },
  {
    title: 'Result Interpretation',
    description:
      'Already have test results but don\'t understand them? Get a clear, plain-language explanation from a qualified specialist.',
    icon: ClipboardList,
    category: 'Interpretation',
  },
  {
    title: 'Follow-up Consultations',
    description:
      'After receiving your report, ask questions. Our AI answers within the scope of the opinion, or book a live consultation.',
    icon: MessageSquareText,
    category: 'Follow-up',
  },
  {
    title: 'Lab Trend Tracking',
    description:
      'Repeat lab tests tracked over time. AI flags statistically significant changes — an early warning for you and your doctor.',
    icon: TrendingUp,
    category: 'Trends',
  },
] as const;
