
> ### Task 1: Update data.ts â€” Content and Data Models
  
  **Files:**
  - Modify: `components/landing-page/data.ts`
  
  **Interfaces:**
  - Produces: Updated `SPECIALIZATIONS` (6 items), `TRUST_POINTS` (4 objection-based items), `SERVICES` (4 items with 
pricing), `STEPS` (3 items)
  
  - [ ] **Step 1: Read current data.ts**
  
  Read `components/landing-page/data.ts` to understand current structure and types.
  
  - [ ] **Step 2: Update SPECIALIZATIONS to 6 items**
  
  Replace the `SPECIALIZATIONS` array. Keep the same type signature `{ title: string; description: string; icon: 
LucideIcon }`. Remove: Clinical Pathology, Fetal Medicine, Pediatrics, Chronic Disease. Keep: Hematopathology, 
Diagnostic Radiology, Cytopathology, Dermatopathology, Women's Health, Oncology. Update descriptions to be more 
outcome-focused:
  
  ```typescript
  export const SPECIALIZATIONS = [
    {
      title: "Hematopathology",
      description: "Blood disorders, bone marrow biopsies, and hematologic malignancies reviewed by subspecialists.",
      icon: Droplets,
    },
    {
      title: "Diagnostic Radiology",
      description: "X-rays, CT scans, MRIs, and ultrasounds interpreted by board-certified radiologists.",
      icon: Scan,
    },
    {
      title: "Cytopathology",
      description: "Fine needle aspirates, Pap smears, and fluid cytology analyzed by cytopathology experts.",
      icon: Microscope,
    },
    {
      title: "Dermatopathology",
      description: "Skin biopsies and lesion specimens reviewed by dermatopathology specialists.",
      icon: Eye,
    },
    {
      title: "Women's Health",
      description: "Gynecological pathology, breast biopsies, and prenatal screening interpretations.",
      icon: Heart,
    },
    {
      title: "Oncology",
      description: "Cancer pathology, tumor grading, and molecular marker interpretation by oncology experts.",
      icon: Stethoscope,
    },
  ] as const;
  ```
  
  Ensure imported icons from `lucide-react` are updated to match: `Droplets, Scan, Microscope, Eye, Heart, 
Stethoscope`.
  
  - [ ] **Step 3: Update TRUST_POINTS to objection-based format**
  
  Replace `TRUST_POINTS` with objection-based trust points:
  
  ```typescript
  export const TRUST_POINTS = [
    {
      question: "Is my data safe?",
      answer: "End-to-end encryption. HIPAA and GDPR compliant. Your medical records never leave our secure platform.",
      icon: Shield,
    },
    {
      question: "Are the specialists qualified?",
      answer: "Every specialist is board-certified and credential-verified. We don't compromise on expertise.",
      icon: Award,
    },
    {
      question: "What if I disagree?",
      answer: "Request a peer review at no extra cost. We stand behind every opinion.",
      icon: RefreshCw,
    },
    {
      question: "How fast is it?",
      answer: "24-48 hours on average. Urgent cases are flagged and prioritized.",
      icon: Clock,
    },
  ] as const;
  ```
  
  Update type to `{ question: string; answer: string; icon: LucideIcon }`. Update imported icons: add `Shield, Award, 
RefreshCw, Clock` from lucide-react.
  
  - [ ] **Step 4: Update SERVICES with pricing**
  
  Replace `SERVICES` array. Add `price` field to type:
  
  ```typescript
  export const SERVICES = [
    {
      title: "Specialist Opinions",
      description: "Upload slides, scans, or reports. Get a board-certified specialist's written opinion within 24-48 
hours.",
      icon: FileText,
      category: "Most Popular",
      price: "From $49",
    },
    {
      title: "Result Interpretation",
      description: "Have lab results but unclear what they mean? Get a specialist's plain-language explanation.",
      icon: ClipboardCheck,
      category: "Popular",
      price: "From $29",
    },
    {
      title: "Follow-up Consultations",
      description: "Questions after your report? Ask our AI assistant or book a live consultation.",
      icon: MessageSquare,
      category: "Support",
      price: "Free / From $39",
    },
    {
      title: "Lab Trend Tracking",
      description: "Track your lab results over time. We flag significant changes before your next appointment.",
      icon: TrendingUp,
      category: "Included",
      price: "Included",
    },
  ] as const;
  ```
  
  Update type to `{ title: string; description: string; icon: LucideIcon; category: string; price: string }`. Update 
imported icons: `FileText, ClipboardCheck, MessageSquare, TrendingUp`.
  
  - [ ] **Step 5: Update STEPS to 3 items**
  
  Replace `STEPS` array with 3 steps:
  
  ```typescript
  export const STEPS = [
    {
      num: "01",
      title: "Upload Your Records",
      description: "Take a photo or upload files. Lab results, scans, slides â€” we accept all formats.",
    },
    {
      num: "02",
      title: "We Match You",
      description: "AI pairs your case with the right board-certified specialist. No guessing, no referrals needed.",
    },
    {
      num: "03",
      title: "Get Your Answer",
      description: "Receive a written specialist opinion within 24-48 hours. Clear, detailed, and in plain language.",
    },
  ] as const;
  ```
  
  - [ ] **Step 6: Add TESTIMONIALS data**
  
  Add a new exported array:
  
  ```typescript
  export const TESTIMONIALS = [
    {
      quote: "I uploaded my lab results on Monday morning and had a specialist opinion by Tuesday evening. For the 
first time, I understood my condition.",
      name: "Sarah M.",
      location: "Nairobi, Kenya",
      rating: 5,
    },
    {
      quote: "My local doctor wasn't sure about my biopsy. Dr. Bubal Care connected me to a pathologist who gave me a 
clear answer in 36 hours.",
      name: "James K.",
      location: "Kampala, Uganda",
      rating: 5,
    },
    {
      quote: "The plain-language summary was the best part. No medical jargon â€” just clear answers I could share 
with my family.",
      name: "Amina H.",
      location: "Dar es Salaam, Tanzania",
      rating: 5,
    },
  ] as const;
  ```
  
  - [ ] **Step 7: Add SPECIALISTS data**
  
  Add a new exported array:
  
  ```typescript
  export const SPECIALISTS = [
    { name: "Dr. A. Mensah", specialty: "Hematopathologist" },
    { name: "Dr. K. Okafor", specialty: "Diagnostic Radiologist" },
    { name: "Dr. P. Njeri", specialty: "Cytopathologist" },
    { name: "Dr. S. Abebe", specialty: "Dermatopathologist" },
    { name: "Dr. L. Mwangi", specialty: "Oncologist" },
  ] as const;
  ```
  
  - [ ] **Step 8: Add FAQ data**
  
  Add a new exported array:
  
  ```typescript
  export const FAQ = [
    {
      question: "How much does it cost?",
      answer: "Pricing varies by service. Most specialist opinions start from $49.",
    },
    {
      question: "What files can I upload?",
      answer: "Lab reports, DICOM scans, histology slides, photos â€” we accept all common formats.",


