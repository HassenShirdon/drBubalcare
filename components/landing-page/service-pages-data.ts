import {
  Baby,
  Globe,
  Heart,
  Stethoscope,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface StepData {
  title: string;
  description: string;
}

export interface ServicePageContent {
  id: string;
  title: string;
  heroTitle: string;
  description: string;
  introduction: string;
  whoCanBenefit: { title: string; description: string; icon: LucideIcon }[];
  whatWeOffer: { title: string; description: string }[];
  howItWorks: StepData[];
  requiredDocuments: string[];
  faqs: { question: string; answer: string }[];
  relatedServices: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const DEFAULT_STEPS: StepData[] = [
  {
    title: "Book Consultation",
    description:
      "Select the service that matches your needs. Pick a convenient time and complete your booking online.",
  },
  {
    title: "Upload Medical Documents",
    description:
      "Upload your reports, scans, or lab results through our secure portal. Everything is encrypted end-to-end.",
  },
  {
    title: "Expert Review",
    description:
      "A board-certified physician from our Global Doctors Network reviews your case alongside our AI pre-screening. Most reviews are completed within 24-48 hours.",
  },
  {
    title: "Receive Personalized Recommendations",
    description:
      "Get a structured written opinion with clear findings and recommendations. A plain-language summary is included.",
  },
];

const DEFAULT_BENEFITS = [
  {
    title: "Adults",
    description: "Individuals seeking expert medical guidance for their health concerns.",
    icon: User,
  },
  {
    title: "International Patients",
    description:
      "Patients anywhere in the world who need expert medical opinions from our Global Doctors Network without leaving home.",
    icon: Globe,
  },
  {
    title: "Families",
    description: "Families coordinating healthcare decisions for multiple members.",
    icon: Users,
  },
];

export const SERVICE_PAGES: Record<string, ServicePageContent> = {
  "medical-second-opinion": {
    id: "medical-second-opinion",
    title: "Medical Second Opinion Center",
    heroTitle: "Medical Second Opinion Center",
    description:
      "Receive an independent review of your diagnosis, treatment plan, laboratory results, medical imaging, and recommendations from your treating physicians.",
    introduction:
      "A medical second opinion provides you with an independent assessment of your diagnosis and treatment plan by a board-certified physician from our Global Doctors Network. Whether you have been diagnosed with a complex condition, recommended for surgery, or want to explore alternative treatment options, our physicians review your complete medical records and deliver a thorough written opinion. This service is for anyone who wants confirmation, clarity, or alternative perspectives on their healthcare decisions.",
    whoCanBenefit: [
      ...DEFAULT_BENEFITS,
      {
        title: "Patients with Chronic Disease",
        description: "Those managing long-term conditions who want a comprehensive treatment review.",
        icon: Stethoscope,
      },
    ],
    whatWeOffer: [
      {
        title: "Treatment Review",
        description: "Comprehensive evaluation of your current treatment plan with evidence-based recommendations.",
      },
      {
        title: "Diagnosis Verification",
        description:
          "Independent confirmation of your diagnosis by a physician in our Global Doctors Network who specializes in the relevant field.",
      },
      {
        title: "Medication Review",
        description: "Assessment of your current medications for appropriateness, interactions, and optimization.",
      },
      {
        title: "Surgical Review",
        description: "Evaluation of surgical recommendations including necessity, risks, and alternatives.",
      },
      {
        title: "Chronic Disease Management",
        description: "Long-term management strategies for conditions like diabetes, hypertension, and autoimmune disorders.",
      },
      {
        title: "Cancer Second Opinions",
        description: "Specialized review of cancer diagnoses, pathology reports, and treatment protocols by oncology experts.",
      },
      {
        title: "International Medical Consultation",
        description:
          "Remote access to expert opinions from our Global Doctors Network, no matter where in the world you live.",
      },
    ],
    howItWorks: DEFAULT_STEPS,
    requiredDocuments: [
      "Medical Reports",
      "Imaging Reports (X-rays, CT scans, MRIs)",
      "Laboratory Results",
      "Medication List",
      "Written Opinions from Previous Consultations",
    ],
    faqs: [
      {
        question: "Why should I get a second medical opinion?",
        answer:
          "A second opinion provides confirmation of your diagnosis, explores alternative treatment options, and gives you peace of mind. It is a standard part of quality healthcare and is recommended for major diagnoses or treatment decisions.",
      },
      {
        question: "How is my privacy protected?",
        answer:
          "All medical records are encrypted end-to-end. Your personal identifiable information is stripped before any AI processing. We are fully compliant with HIPAA and GDPR standards.",
      },
      {
        question: "What types of conditions can be reviewed?",
        answer:
          "Our Global Doctors Network covers a wide range of conditions including cancer, cardiovascular disease, autoimmune disorders, neurological conditions, endocrine disorders, and more. If you have a diagnosis you want verified, we can help.",
      },
      {
        question: "How long does the review process take?",
        answer:
          "Most cases are reviewed within 24-48 hours. Urgent cases can be flagged and prioritized. The timeline depends on the complexity of your case and the availability of physicians in the relevant subspecialty within our network.",
      },
      {
        question: "Can I choose which doctor reviews my case?",
        answer:
          "Our AI system matches your case to the most appropriate physician in our Global Doctors Network based on subspecialty and current availability. If you have a preference, you can note it during submission and we will accommodate when possible.",
      },
      {
        question: "What if my case is urgent?",
        answer:
          "Urgent cases are flagged during submission and prioritized in the review queue. If critical findings are identified, we will attempt immediate phone or WhatsApp contact in addition to the portal notification.",
      },
    ],
    relatedServices: ["laboratory-diagnostic-center", "medical-nutrition-therapy"],
    seo: {
      title: "Medical Second Opinion Center | Dr Bubal Care",
      description:
        "Get an independent review of your diagnosis and treatment plan from board-certified physicians in our Global Doctors Network. Treatment review, diagnosis verification, medication review, and more.",
      keywords: [
        "medical second opinion",
        "diagnosis verification",
        "treatment review",
        "cancer second opinion",
        "expert medical review",
      ],
    },
  },

  "laboratory-diagnostic-center": {
    id: "laboratory-diagnostic-center",
    title: "Laboratory & Diagnostic Center",
    heroTitle: "Laboratory & Diagnostic Center",
    description:
      "Professional interpretation of laboratory tests and diagnostic imaging to help patients understand their health.",
    introduction:
      "Understanding your lab results and diagnostic imaging is essential for making informed healthcare decisions. Physicians in our Global Doctors Network provide clear, professional interpretation of laboratory tests, MRI scans, CT scans, ECGs, and other diagnostic studies. We explain what your results mean, highlight any areas of concern, and recommend appropriate next steps. This service bridges the gap between raw test data and actionable health insights.",
    whoCanBenefit: [
      ...DEFAULT_BENEFITS,
      {
        title: "Patients with Chronic Disease",
        description: "Those monitoring conditions like diabetes, kidney disease, or thyroid disorders through regular lab work.",
        icon: Stethoscope,
      },
    ],
    whatWeOffer: [
      {
        title: "Laboratory Interpretation",
        description: "Clear explanation of blood tests, urinalysis, and other laboratory results with clinical context.",
      },
      {
        title: "Disease Monitoring",
        description: "Tracking disease markers over time to assess treatment effectiveness and disease progression.",
      },
      {
        title: "Risk Prediction",
        description: "Assessment of your test results to identify potential health risks before they become serious.",
      },
      {
        title: "Quality Assurance",
        description: "Verification that your lab results meet quality standards and are clinically consistent.",
      },
      {
        title: "Laboratory Second Review",
        description:
          "Independent re-evaluation of your lab results by a second physician in our network for confirmation.",
      },
      {
        title: "MRI Review",
        description:
          "Expert interpretation of magnetic resonance imaging studies by board-certified radiologists.",
      },
      {
        title: "CT Review",
        description: "Detailed analysis of computed tomography scans for accurate diagnosis.",
      },
      {
        title: "ECG Interpretation",
        description: "Expert reading of electrocardiograms to assess heart health and identify abnormalities.",
      },
    ],
    howItWorks: DEFAULT_STEPS,
    requiredDocuments: [
      "Laboratory Results",
      "Imaging Reports (if applicable)",
      "Medical History Summary",
      "Current Medication List",
      "Referral Letters",
    ],
    faqs: [
      {
        question: "What types of lab tests can you interpret?",
        answer:
          "We interpret a wide range of tests including complete blood counts, metabolic panels, thyroid function tests, hormone panels, cancer markers, vitamin deficiency tests, liver and kidney function tests, and more.",
      },
      {
        question: "How is this different from my doctor's explanation?",
        answer:
          "Your results are interpreted by experienced physicians in our Global Doctors Network and come with detailed clinical context. We explain what each result means, how it relates to your overall health, and what follow-up steps may be appropriate.",
      },
      {
        question: "Can you review imaging studies like MRIs and CT scans?",
        answer:
          "Yes. Our Global Doctors Network includes board-certified radiologists who can review and interpret MRI, CT, X-ray, and ultrasound studies with detailed findings and impressions.",
      },
      {
        question: "How do I upload my lab results?",
        answer:
          "You can upload PDF reports, images of your results, or digital files through our secure portal. All uploads are encrypted and stored safely.",
      },
      {
        question: "What conditions can you help diagnose through lab interpretation?",
        answer:
          "We provide interpretation for a broad range of conditions including diabetes, kidney disease, thyroid disorders, hormonal imbalances, cancer markers, vitamin deficiencies, liver disease, and cardiovascular disease.",
      },
      {
        question: "How quickly will I receive my interpretation?",
        answer:
          "Most lab interpretations are completed within 24-48 hours. Complex cases involving multiple tests or imaging may take slightly longer.",
      },
    ],
    relatedServices: ["medical-second-opinion", "medical-nutrition-therapy"],
    seo: {
      title: "Laboratory & Diagnostic Center | Dr Bubal Care",
      description:
        "Professional interpretation of lab tests, MRI, CT scans, and ECGs. Understand your results with clear explanations from board-certified physicians in our Global Doctors Network.",
      keywords: [
        "lab test interpretation",
        "MRI review",
        "CT scan review",
        "ECG interpretation",
        "diagnostic imaging",
      ],
    },
  },

  "medical-nutrition-therapy": {
    id: "medical-nutrition-therapy",
    title: "Medical Nutrition Therapy Center",
    heroTitle: "Medical Nutrition Therapy Center",
    description:
      "Personalized nutrition therapy designed to prevent disease and improve long-term health outcomes.",
    introduction:
      "Medical Nutrition Therapy (MNT) is a evidence-based approach to treating medical conditions through personalized dietary interventions. Clinicians in our Global Doctors Network develop customized nutrition plans that complement your medical treatment, help manage chronic conditions, and improve your overall health. Whether you are managing diabetes, kidney disease, or simply want to optimize your nutrition, our experts provide practical, science-backed guidance.",
    whoCanBenefit: [
      ...DEFAULT_BENEFITS,
      {
        title: "Children",
        description: "Parents seeking expert nutrition guidance for their children's growth and development.",
        icon: Baby,
      },
    ],
    whatWeOffer: [
      {
        title: "Diabetes Nutrition",
        description: "Personalized meal planning and nutritional strategies for blood glucose management.",
      },
      {
        title: "Kidney Nutrition",
        description: "Specialized dietary guidance for chronic kidney disease, dialysis, and transplant patients.",
      },
      {
        title: "Hypertension Diet",
        description: "Evidence-based dietary approaches to lower blood pressure and support cardiovascular health.",
      },
      {
        title: "Pregnancy Nutrition",
        description: "Nutritional guidance for healthy pregnancy, fetal development, and postpartum recovery.",
      },
      {
        title: "Child Nutrition",
        description: "Age-appropriate nutrition plans for healthy growth, development, and eating habits.",
      },
      {
        title: "Elderly Nutrition",
        description: "Tailored nutrition plans addressing the unique needs of aging adults.",
      },
      {
        title: "Weight Management",
        description: "Science-based strategies for healthy weight loss, maintenance, and metabolic health.",
      },
      {
        title: "Malnutrition",
        description: "Assessment and treatment of undernutrition and nutrient deficiencies.",
      },
      {
        title: "Micronutrients",
        description: "Identification and correction of vitamin and mineral imbalances through diet and supplementation.",
      },
      {
        title: "Lifestyle Counseling",
        description: "Holistic guidance integrating nutrition with physical activity and healthy lifestyle habits.",
      },
    ],
    howItWorks: DEFAULT_STEPS,
    requiredDocuments: [
      "Medical Reports",
      "Laboratory Results (recent)",
      "Current Diet Diary (if available)",
      "Medication List",
      "Allergy Information",
    ],
    faqs: [
      {
        question: "What is Medical Nutrition Therapy?",
        answer:
          "Medical Nutrition Therapy is a therapeutic approach to treating medical conditions through personalized nutrition plans developed by qualified clinicians in our Global Doctors Network. Unlike general dietary advice, MNT is tailored to your specific medical condition, lab results, and health goals.",
      },
      {
        question: "How is this different from seeing a regular nutritionist?",
        answer:
          "Our service is provided by clinicians in our Global Doctors Network who integrate nutrition therapy with your overall medical care. We review your lab results, medical history, and current treatments to create nutrition plans that work alongside your medical treatment.",
      },
      {
        question: "Can nutrition therapy help manage my diabetes?",
        answer:
          "Yes. Medical nutrition therapy is a cornerstone of diabetes management. Our clinicians can help you develop meal plans that stabilize blood sugar, reduce complications, and improve your quality of life.",
      },
      {
        question: "Do you provide meal plans or just general advice?",
        answer:
          "We provide personalized, structured meal plans tailored to your medical condition, food preferences, cultural considerations, and lifestyle. Our recommendations are practical and actionable.",
      },
      {
        question: "What conditions can nutrition therapy address?",
        answer:
          "Nutrition therapy can help manage diabetes, kidney disease, hypertension, heart disease, digestive disorders, food allergies, pregnancy nutrition, child nutrition, weight management, and many other conditions.",
      },
      {
        question: "How long does it take to see results from nutrition therapy?",
        answer:
          "Results vary depending on the condition and individual factors. Some patients see improvements in lab values within weeks, while others may need several months of consistent dietary changes. We provide ongoing support and adjustments.",
      },
    ],
    relatedServices: ["child-health-development", "womens-health-fertility"],
    seo: {
      title: "Medical Nutrition Therapy Center | Dr Bubal Care",
      description:
        "Personalized nutrition therapy for diabetes, kidney disease, pregnancy, weight management, and more. Evidence-based dietary guidance from our Global Doctors Network.",
      keywords: [
        "medical nutrition therapy",
        "diabetes nutrition",
        "kidney diet",
        "weight management",
        "pregnancy nutrition",
        "dietary counseling",
      ],
    },
  },

  "child-health-development": {
    id: "child-health-development",
    title: "Child Health & Development Center",
    heroTitle: "Child Health & Development Center",
    description:
      "Supporting healthy growth and development from pregnancy through adolescence.",
    introduction:
      "Every child deserves the best possible start in life. Our Child Health and Development Center provides comprehensive support for parents and caregivers, covering everything from pregnancy education to adolescent health. Clinicians in our Global Doctors Network offer evidence-based guidance on nutrition, growth monitoring, developmental milestones, vaccination, and common childhood health concerns. We help families navigate the critical early years with confidence.",
    whoCanBenefit: [
      {
        title: "Expectant Parents",
        description: "Parents preparing for pregnancy and early parenthood with expert guidance.",
        icon: Heart,
      },
      {
        title: "New Parents",
        description: "Families with infants needing support on breastfeeding, nutrition, and development.",
        icon: Baby,
      },
      {
        title: "Families with Children",
        description: "Parents seeking guidance on child nutrition, growth, behavior, and overall health.",
        icon: Users,
      },
      {
        title: "Adolescents",
        description: "Teenagers and their families navigating physical, emotional, and social development.",
        icon: Users,
      },
    ],
    whatWeOffer: [
      {
        title: "Pregnancy Education",
        description: "Evidence-based guidance on prenatal care, nutrition, and preparation for childbirth.",
      },
      {
        title: "Brain Development",
        description: "Understanding and supporting cognitive development from infancy through adolescence.",
      },
      {
        title: "Breastfeeding",
        description: "Expert support and guidance for successful breastfeeding and common challenges.",
      },
      {
        title: "Complementary Feeding",
        description: "Guidance on introducing solid foods and building healthy eating habits from the start.",
      },
      {
        title: "Child Nutrition",
        description: "Age-appropriate nutrition plans for healthy growth, development, and lifelong health.",
      },
      {
        title: "Growth Monitoring",
        description: "Tracking physical growth, developmental milestones, and early detection of concerns.",
      },
      {
        title: "Vaccination",
        description: "Evidence-based information on childhood immunizations and vaccination schedules.",
      },
      {
        title: "Developmental Milestones",
        description: "Monitoring and support for motor, language, social, and cognitive development.",
      },
      {
        title: "Learning Difficulties",
        description: "Early identification and support strategies for learning and developmental challenges.",
      },
      {
        title: "Behavior and Mental Health",
        description: "Guidance on behavioral issues, emotional regulation, and childhood mental health.",
      },
      {
        title: "Adolescent Health",
        description: "Support for the physical, emotional, and social changes during adolescence.",
      },
    ],
    howItWorks: DEFAULT_STEPS,
    requiredDocuments: [
      "Child Health Records",
      "Growth Charts",
      "Vaccination Records",
      "Developmental Screening Results",
      "School Reports (if applicable)",
    ],
    faqs: [
      {
        question: "At what age should I start bringing my child for health reviews?",
        answer:
          "You can start from pregnancy itself. We provide guidance from prenatal care through adolescence. Early monitoring of growth and development helps identify and address concerns before they become significant.",
      },
      {
        question: "How often should my child's growth be monitored?",
        answer:
          "Regular monitoring is recommended at key developmental stages. Our clinicians can create a personalized monitoring schedule based on your child's age, health status, and specific needs.",
      },
      {
        question: "Can you help with breastfeeding challenges?",
        answer:
          "Yes. Clinicians in our network provide evidence-based guidance on breastfeeding positions, latch issues, milk supply concerns, and common breastfeeding problems. We also offer complementary feeding guidance for transitioning to solids.",
      },
      {
        question: "What vaccinations does my child need?",
        answer:
          "We provide up-to-date, evidence-based information on recommended vaccination schedules based on your country's guidelines and your child's specific health needs.",
      },
      {
        question: "How can I tell if my child is developing normally?",
        answer:
          "Our clinicians assess your child's development against standard milestones for their age group. We track motor skills, language development, social interaction, and cognitive abilities. If there are any concerns, we provide early intervention strategies.",
      },
      {
        question: "Do you provide support for children with learning difficulties?",
        answer:
          "Yes. We offer guidance on early identification of learning difficulties, strategies for supporting your child's education, and referrals to the right physicians in our Global Doctors Network when needed.",
      },
      {
        question: "What adolescent health services do you provide?",
        answer:
          "We provide guidance on puberty, nutrition for teenagers, mental health support, healthy lifestyle habits, and preventive health education tailored to adolescents.",
      },
    ],
    relatedServices: ["womens-health-fertility", "medical-nutrition-therapy"],
    seo: {
      title: "Child Health & Development Center | Dr Bubal Care",
      description:
        "Supporting healthy growth from pregnancy through adolescence. Breastfeeding, child nutrition, growth monitoring, vaccination, and developmental support.",
      keywords: [
        "child health",
        "pediatric nutrition",
        "growth monitoring",
        "vaccination",
        "breastfeeding support",
        "adolescent health",
      ],
    },
  },

  "womens-health-fertility": {
    id: "womens-health-fertility",
    title: "Women's Health & Fertility Center",
    heroTitle: "Women's Health & Fertility Center",
    description:
      "Evidence-based reproductive health guidance, fertility education, pregnancy planning, and women's wellness.",
    introduction:
      "Our Women's Health and Fertility Center provides comprehensive, evidence-based guidance on reproductive health, fertility, and women's wellness. Whether you are trying to conceive, managing a reproductive health condition, or seeking information about fertility treatments, physicians in our Global Doctors Network provide clear, compassionate, and medically sound advice. We empower women with the knowledge they need to make informed decisions about their reproductive health.",
    whoCanBenefit: [
      {
        title: "Women Planning Pregnancy",
        description: "Individuals and couples preparing for pregnancy and seeking fertility guidance.",
        icon: Heart,
      },
      {
        title: "Women with Reproductive Concerns",
        description: "Those managing conditions like PCOS, infertility, or hormonal imbalances.",
        icon: User,
      },
      {
        title: "Couples Seeking Fertility Treatment",
        description: "Partners exploring IVF, IUI, and other assisted reproductive technologies.",
        icon: Users,
      },
      {
        title: "International Patients",
        description: "Women worldwide seeking expert reproductive health guidance remotely.",
        icon: Globe,
      },
    ],
    whatWeOffer: [
      {
        title: "Infertility Evaluation",
        description: "Comprehensive assessment of fertility factors including hormonal, anatomical, and lifestyle considerations.",
      },
      {
        title: "PCOS Management",
        description: "Evidence-based guidance on managing Polycystic Ovary Syndrome through lifestyle, nutrition, and medical interventions.",
      },
      {
        title: "Ovulation Tracking",
        description: "Education and guidance on ovulation monitoring, cycle tracking, and timing for conception.",
      },
      {
        title: "Pregnancy Planning",
        description: "Preconception health optimization, nutrition, and lifestyle guidance for a healthy pregnancy.",
      },
      {
        title: "Male Infertility",
        description: "Assessment and guidance on male factor infertility including semen analysis interpretation.",
      },
      {
        title: "Lifestyle Optimization",
        description: "Evidence-based lifestyle modifications to improve fertility outcomes and reproductive health.",
      },
      {
        title: "Fertility Nutrition",
        description: "Specialized nutritional guidance to support fertility, hormone balance, and reproductive health.",
      },
      {
        title: "IVF Education",
        description: "Comprehensive education about in-vitro fertilization, treatment options, success rates, and what to expect.",
      },
    ],
    howItWorks: DEFAULT_STEPS,
    requiredDocuments: [
      "Medical History",
      "Previous Fertility Test Results",
      "Hormone Panel Results",
      "Ultrasound Reports",
      "Partner's Semen Analysis (if applicable)",
    ],
    faqs: [
      {
        question: "When should I seek fertility guidance?",
        answer:
          "If you are under 35 and have been trying to conceive for 12 months without success, or over 35 and trying for 6 months, it is recommended to seek fertility guidance. You should also seek advice if you have irregular periods, known reproductive conditions, or a history of pregnancy loss.",
      },
      {
        question: "Can you help with PCOS?",
        answer:
          "Yes. We provide comprehensive guidance on managing PCOS including dietary strategies, lifestyle modifications, medication options, and fertility planning. Our clinicians help you understand your condition and develop a personalized management plan.",
      },
      {
        question: "What fertility treatments do you provide education on?",
        answer:
          "We provide education on a range of fertility treatments including ovulation induction, IUI (intrauterine insemination), IVF (in-vitro fertilization), ICSI, and fertility preservation options. We explain the process, success rates, risks, and what to expect at each stage.",
      },
      {
        question: "Do you address male infertility?",
        answer:
          "Yes. Infertility affects both partners equally. We provide assessment and guidance on male factor infertility including semen analysis interpretation, lifestyle factors affecting sperm health, and treatment options.",
      },
      {
        question: "How does nutrition affect fertility?",
        answer:
          "Nutrition plays a crucial role in reproductive health. Our fertility nutrition experts provide evidence-based dietary guidance to support hormone balance, egg quality, sperm health, and overall fertility outcomes.",
      },
      {
        question: "What if I am not ready for IVF? Are there other options?",
        answer:
          "Absolutely. We explore all options based on your individual situation including lifestyle modifications, ovulation tracking, fertility medications, and less invasive treatments. IVF is only one of many options we discuss.",
      },
      {
        question: "Is this service confidential?",
        answer:
          "Yes. All consultations and medical information are completely confidential. Our platform is HIPAA and GDPR compliant, and your personal information is encrypted end-to-end.",
      },
    ],
    relatedServices: ["child-health-development", "medical-nutrition-therapy"],
    seo: {
      title: "Women's Health & Fertility Center | Dr Bubal Care",
      description:
        "Evidence-based reproductive health guidance, fertility education, PCOS management, pregnancy planning, and women's wellness from board-certified physicians in our Global Doctors Network.",
      keywords: [
        "women's health",
        "fertility",
        "PCOS",
        "IVF education",
        "pregnancy planning",
        "reproductive health",
      ],
    },
  },
};

export const SERVICE_LIST = Object.values(SERVICE_PAGES).map((s) => ({
  title: s.title,
  link: `/services/${s.id}`,
}));
