'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Stethoscope, ArrowRight, BadgeCheck, BarChart3, MessageSquareText, Eye, X, Briefcase, HeartPulse, FlaskConical, FileText, Cpu, Globe, Brain, Dna } from 'lucide-react';
import LatestNewsClient from '@/components/latest-news-client';
import ContactSection from '@/components/landing-page/contact-section';

const SERVICES = [
  {
    id: 'second-opinion',
    title: 'Global Second Opinion',
    description: 'Access a network of internationally recognized specialists to validate diagnoses and explore advanced treatment alternatives before making critical decisions.',
    icon: Globe,
    category: 'Opinion'
  },
  {
    id: 'chronic',
    title: 'Chronic Disease Management',
    description: 'Structured, long-term care plans focusing on stability and quality of life, coordinated across boundaries.',
    icon: HeartPulse,
    category: 'Chronic'
  },
  {
    id: 'neuro',
    title: 'Neurological Consultations',
    description: 'Expert assessment and guidance for complex central nervous system disorders, led by top research physicians.',
    icon: Brain,
    category: 'Specialty'
  }
];

const DOCTORS = [
  {
    name: 'Dr. Alistair Bubal, MD, PhD',
    role: 'Chief Medical Officer',
    specialty: 'Internal Medicine',
    experience: '20+ years',
    description: 'Specializing in internal medicine and complex diagnostic dilemmas, with over 20 years of international clinical experience.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiu5UnVFta-73PrVhGGaik5BB2EMLkXsU2pIjgZoyUkgBmnhsvFOrmLt1bB5qI5eJwm7shojburr0bbeCYUQagHJOZyoH3g7KYnuPwMJ5dCoORtL4eoOO_A4bxLAhLo8sXGP5gzQx-UGqcP9WwWt5WwGf34MqxMmSLlK070_apWWO_18Jcfjegcbs3B2xHiJqmco7BNn3XUy0Kfx5g4clQK1KpHyIdSxSRy7zA352JFdqxybEs3fdyYg'
  },
  {
    name: 'Dr. Sarah Jenkins, FRCP',
    role: 'Head of Neurology',
    specialty: 'Neurodegenerative Diseases',
    experience: '18+ years',
    description: 'A leading authority in neurodegenerative diseases, dedicated to translating cutting-edge research into patient-centered care.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3wkG3ss332MMkaR_tKKJ5p5aNsX6XSdyj0NGdmZ1Bv6kn3dQ28wOzf2ZfC70N4Vu_u3ykDx0BvNP3OkrAdsIwkJwdSXkGcotwgORWB9LdnXkVBw5PFyF-NORIBQxfsrCee6_jNHfpwreuEVuy7OmjCTtVbrdWQOrjy0v1uV_d2Ok8T6-A3jpwOREFvjlY8MZOCgV9A6fXUzZ_zhQYx3Y2jl4MVI3OPytmHY956oNGAGAGpVoiWbOhqQ'
  },
  {
    name: 'Dr. Michael Chen, FACC',
    role: 'Director of Cardiology',
    specialty: 'Cardiovascular Interventions',
    experience: '15+ years',
    description: 'Pioneering non-invasive cardiac imaging techniques and developing personalized cardiovascular intervention strategies.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu3xTk6UH2VHm7EphBWbF6rQMLhRniz0MX-uHUOxs1mvPBWtAfstrG-gb7Pc5L4dFZWowyEw5pJ4w-osQtgvGwKhs7k1Y_G2Q4yyHTAd35uCsNesN7tXWQKueV_eVhPPRhCP3fqHzY--sa28ZJJX2vKwcbVFMXpb9PyI-NV_mVtqsVLGtqsmf99zl1Dc230s9MpFn2f-AeIxITH8wdsQmtAwSmEH-kOUxH97LBQyMLRVpflRjD72aeXg'
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
} as const;

export default function Home() {
  const [selectedDoctor, setSelectedDoctor] = useState<typeof DOCTORS[0] | null>(null);

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased pt-24 selection:bg-healing-teal/30 selection:text-clinical-navy scroll-smooth">
      {/* Navigation */}
      <nav className="bg-white border-b border-surface-gray/50 fixed top-0 w-full z-50 h-16">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-16 h-full">
          <Link href="/" className="font-headline-md text-lg font-semibold tracking-tight text-clinical-navy">
            Dr Bubal Care
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            {['Services', 'About', 'Doctors', 'News', 'Contact'].map((item) =>
              item === 'News' ? (
                <Link
                  key={item}
                  href="/news"
                  className="font-label-md text-sm text-on-surface-variant hover:text-clinical-navy transition-colors px-3 py-2 rounded-lg hover:bg-surface-container-low"
                >
                  News
                </Link>
              ) : item === 'Contact' ? (
                <a
                  key={item}
                  href="#contact"
                  className="font-label-md text-sm text-on-surface-variant hover:text-clinical-navy transition-colors px-3 py-2 rounded-lg hover:bg-surface-container-low"
                >
                  Contact
                </a>
              ) : (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="font-label-md text-sm text-on-surface-variant hover:text-clinical-navy transition-colors px-3 py-2 rounded-lg hover:bg-surface-container-low"
                >
                  {item}
                </a>
              )
            )}
          </div>
          <Link
            href="/patient"
            className="bg-clinical-navy text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-primary-container transition-all"
          >
            Patient Portal
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="relative pt-32 pb-20 px-6 md:px-16 min-h-[70vh] flex items-center justify-center" id="home">
          <div className="relative z-10 max-w-4xl mx-auto w-full">
            <div className="text-center max-w-2xl mx-auto space-y-5">
              <div className="inline-flex items-center space-x-2 bg-evidence-blue-light px-3 py-1 rounded-full text-clinical-navy text-xs font-medium border border-clinical-navy/10">
                <span className="w-1.5 h-1.5 rounded-full bg-healing-teal" aria-hidden="true"></span>
                <span>Global Telehealth &amp; Referral Platform</span>
              </div>
              <h1 className="font-headline-md text-4xl md:text-5xl text-text-medical-black tracking-tight font-semibold leading-tight text-balance">
                Global Medical Coordination,<br />
                <span className="text-clinical-navy">Precision Delivered.</span>
              </h1>
              <p className="font-body-lg text-base md:text-lg text-on-surface-variant/80 leading-relaxed max-w-xl mx-auto">
                Connecting diaspora patients and referring physicians to world-class specialists — one platform.
              </p>
              <div className="pt-2">
                <Link href="/patient" className="inline-flex items-center gap-2 bg-clinical-navy text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-primary-container transition-all shadow-sm">
                  Get Started
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Who We Serve Section */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="py-16 bg-white border-y border-surface-gray/50">
          <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">Who We Serve</h2>
              <p className="font-body-lg text-base text-on-surface-variant/80">Two sides of the same mission &mdash; better global healthcare coordination.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patients card */}
              <div className="bg-white rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-4">
                  <HeartPulse className="text-lg" aria-hidden="true" />
                </div>
                <h3 className="font-headline-md text-lg font-semibold text-clinical-navy mb-2">For Patients</h3>
                <p className="font-body-md text-sm text-on-surface-variant/80 mb-5 leading-relaxed">
                  Get second opinions, track lab results, upload records, and receive plain-language interpretations. Your entire diagnostic journey in one place.
                </p>
                <Link href="/patient" className="inline-flex items-center text-clinical-navy font-medium text-sm group-hover:text-healing-teal transition-colors">
                  Start a Case <ArrowRight className="ml-1 size-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
              {/* Physicians card */}
              <div className="bg-white rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-4">
                  <Stethoscope className="text-lg" aria-hidden="true" />
                </div>
                <h3 className="font-headline-md text-lg font-semibold text-clinical-navy mb-2">For Referring Physicians</h3>
                <p className="font-body-md text-sm text-on-surface-variant/80 mb-5 leading-relaxed">
                  Submit cases, track referral completion, receive structured results. Free to join. The loop is always closed.
                </p>
                <Link href="/doctor" className="inline-flex items-center text-clinical-navy font-medium text-sm group-hover:text-healing-teal transition-colors">
                  Join Free <ArrowRight className="ml-1 size-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="py-16 bg-surface border-b border-surface-gray/50">
          <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">How It Works</h2>
              <p className="font-body-lg text-base text-on-surface-variant/80">From first contact to final answer &mdash; we handle the coordination.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-clinical-navy/10"></div>
              {[
                { num: '01', title: 'Open a Case', desc: 'Select your service, upload records, describe your needs. Takes under 5 minutes.' },
                { num: '02', title: 'AI Coordinates', desc: 'Smart triage matches you to the right specialist. Agents begin dossier preparation.' },
                { num: '03', title: 'Everyone Stays Informed', desc: 'Real-time status for patients and physicians. No one has to chase anyone.' },
                { num: '04', title: 'Clarity Delivered', desc: 'Result uploaded, plain-language summary generated, next steps recommended.' },
              ].map((step, i) => (
                <div key={i} className="relative text-center md:text-left">
                  <div className="w-10 h-10 rounded-full bg-evidence-blue-light flex items-center justify-center text-clinical-navy font-headline-md font-semibold text-sm mb-4 mx-auto md:mx-0 relative z-10">
                    {step.num}
                  </div>
                  <h3 className="font-headline-md text-sm font-semibold text-clinical-navy mb-1.5">{step.title}</h3>
                  <p className="font-body-md text-on-surface-variant/80 leading-relaxed text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* AI Intelligence Section */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="py-16 bg-white border-b border-surface-gray/50">
          <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 bg-evidence-blue-light px-3 py-1 rounded-full text-clinical-navy text-xs font-medium uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-healing-teal" aria-hidden="true"></span>
                <span>AI-Powered</span>
              </div>
              <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">Intelligence Built Into Every Step</h2>
              <p className="font-body-lg text-base text-on-surface-variant/80">Not a chatbot. Three specialized AI agents triggered by real events in your diagnostic journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: FlaskConical, title: 'Lab Analysis Agent', desc: 'Automated biomarker extraction and risk flagging from uploaded lab reports. Flags abnormal values for immediate physician review.' },
                { icon: FileText, title: 'Dossier Synthesizer', desc: 'Transforms messy medical records into a structured chronological timeline — clinician-ready in seconds.' },
                { icon: Cpu, title: 'Smart Triage & Matching', desc: 'Routes every case to the optimal global specialist based on clinical data, expertise, and availability.' },
              ].map((item, i) => (
                <div key={i} className="bg-surface rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-healing-teal/10 flex items-center justify-center text-healing-teal">
                      <item.icon className="text-lg" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-healing-teal bg-healing-teal/10 px-2 py-0.5 rounded">Agent</span>
                  </div>
                  <h3 className="font-headline-md text-base font-semibold text-clinical-navy mb-2">{item.title}</h3>
                  <p className="font-body-md text-on-surface-variant/80 leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="py-16 bg-white border-y border-surface-gray/60" id="services">
          <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">Our Services</h2>
              <p className="font-body-lg text-base text-on-surface-variant/80">Evidence-based pathways designed for clarity and positive clinical outcomes.</p>
            </div>
            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((service) => (
                <div 
                  key={service.id}
                  className="bg-white rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="w-10 h-10 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-4 group-hover:bg-clinical-navy group-hover:text-white transition-colors duration-300">
                    <service.icon className="text-lg" aria-hidden="true" />
                  </div>
                  <h3 className="font-headline-md text-base font-semibold text-clinical-navy mb-2 group-hover:text-healing-teal transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant/80 mb-5 flex-grow">
                    {service.description}
                  </p>
                  <Link 
                    href={`/directory?category=${service.category}`} 
                    className="inline-flex items-center text-clinical-navy font-medium text-sm mt-auto group-hover:text-healing-teal transition-colors"
                  >
                    Learn More <ArrowRight className="ml-1 size-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              ))}
              {/* Service Card 4 (Featured Span) */}
              <div className="md:col-span-2 lg:col-span-3 bg-clinical-navy rounded-2xl p-6 md:p-8 border border-clinical-navy shadow-md transition-all duration-300 group flex flex-col md:flex-row gap-6 items-center">
                <div className="relative z-10 md:w-2/3 flex flex-col h-full">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-healing-teal mb-4">
                    <Dna className="text-lg" aria-hidden="true" />
                  </div>
                  <h3 className="font-headline-md text-lg font-semibold text-white mb-2">Precision Medicine &amp; Genomics</h3>
                  <p className="font-body-md text-white/80 mb-5 max-w-2xl text-sm">
                    Tailoring treatment protocols based on individual genetic profiles and advanced molecular diagnostics to maximize efficacy and minimize adverse reactions.
                  </p>
                  <Link 
                    href="/directory?precision=true" 
                    className="inline-flex items-center text-healing-teal font-medium text-sm mt-auto w-fit hover:text-white transition-colors"
                  >
                    Learn More <ArrowRight className="ml-1 size-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="py-16 px-6 md:px-16 max-w-7xl mx-auto" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-square border border-surface-gray/50 shadow-md">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOo1QbVA7S5B0grCgBsTZyEm-jcginPYkGx3-RWzebWY4BUk59gmcV8PKbOr-1VLPlROdvg5KCJ85ABfjR3-kwozqSmS4m2QqJWFSjhGhH5llUJi8mCiRQfG7VxFD4P1SWvyBvvJp6KkfNPCN9a9vdcEwQUawhEf8vLtbQNcOzfBX4JFB7uFjbgSncc0kbszxdFPcL4jINByXDDjJmVmKwKCgrlpU3tYhgbCmQu3qGRcEpC-WISRbhEw"
                alt="A diverse team of senior medical professionals"
                fill
                className="object-cover grayscale-[10%]"
                unoptimized
              />
              <div className="absolute inset-0 bg-clinical-navy/5 mix-blend-multiply"></div>
            </div>
            <div className="space-y-5">
              <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black leading-tight text-balance">Advancing Global Health Through Evidence</h2>
              <p className="font-body-lg text-sm text-on-surface-variant leading-relaxed">
                Dr. Bubal Care was founded on a singular principle: clinical decisions should be driven by rigorous data, peer-reviewed research, and unparalleled expertise. We bridge the gap between complex medical literature and actionable patient care.
              </p>
              {/* Why Choose Us List */}
              <div className="space-y-4 pt-4 border-t border-surface-gray/50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-container-low border border-surface-gray flex items-center justify-center text-healing-teal mt-0.5">
                    <BadgeCheck className="text-base" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-sm font-semibold text-clinical-navy mb-0.5">Board-Certified Specialists</h4>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">Every consultation is led by physicians recognized as leaders in their respective fields.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-container-low border border-surface-gray flex items-center justify-center text-healing-teal mt-0.5">
                    <BarChart3 className="text-base" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-sm font-semibold text-clinical-navy mb-0.5">Data-Driven Protocols</h4>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">Treatment pathways adhere strictly to the latest international medical guidelines.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-container-low border border-surface-gray flex items-center justify-center text-healing-teal mt-0.5">
                    <MessageSquareText className="text-base" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-sm font-semibold text-clinical-navy mb-0.5">Transparent Communication</h4>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">Complex medical jargon is translated into clear, actionable intelligence for patients.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Statistics Banner */}
          <div className="mt-12 bg-white border border-surface-gray/50 rounded-2xl p-6 shadow grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-surface-gray/50">
            <div className="text-center px-3 pt-3 md:pt-0 first:pt-0">
              <div className="font-headline-md text-2xl lg:text-3xl font-bold text-clinical-navy mb-1">15+</div>
              <div className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-medium">Years Experience</div>
            </div>
            <div className="text-center px-3 pt-4 md:pt-0">
              <div className="font-headline-md text-2xl lg:text-3xl font-bold text-clinical-navy mb-1">50k</div>
              <div className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-medium">Patients Guided</div>
            </div>
            <div className="text-center px-3 pt-4 md:pt-0">
              <div className="font-headline-md text-2xl lg:text-3xl font-bold text-clinical-navy mb-1">120</div>
              <div className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-medium">Global Specialists</div>
            </div>
            <div className="text-center px-3 pt-4 md:pt-0">
              <div className="font-headline-md text-2xl lg:text-3xl font-bold text-healing-teal mb-1">98%</div>
              <div className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-medium">Clinical Accuracy</div>
            </div>
          </div>
        </motion.section>

        {/* Doctors Section */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="py-16 bg-white border-t border-surface-gray/50" id="doctors">
          <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">Meet Our Lead Specialists</h2>
              <p className="font-body-lg text-base text-on-surface-variant">Authority rooted in rigorous academic training and decades of clinical practice.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DOCTORS.map((doctor) => (
                <div 
                  key={doctor.name}
                  className="bg-white rounded-2xl overflow-hidden border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300 group flex flex-col h-full cursor-pointer"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="aspect-[16/10] overflow-hidden relative bg-surface-gray">
                    <Image
                      src={doctor.img}
                      alt={doctor.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      unoptimized
                    />
                  </div>
                  <div className="p-5 space-y-3 flex-grow flex flex-col bg-white">
                    <div>
                      <h3 className="font-headline-md text-base text-clinical-navy font-semibold mb-0.5">{doctor.name}</h3>
                      <p className="font-label-md text-[11px] text-healing-teal uppercase tracking-wide font-medium">{doctor.role}</p>
                    </div>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed flex-grow">{doctor.description}</p>
                    <button 
                      type="button"
                      className="inline-flex items-center text-clinical-navy font-medium text-xs mt-2 hover:text-healing-teal transition-colors text-left"
                    >
                      Quick View <Eye className="ml-1 size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Doctor Quick-View Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Doctor details">
            <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative border border-surface-gray">
              <button 
                type="button"
                aria-label="Close quick view"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-gray text-clinical-navy hover:bg-clinical-navy hover:text-white flex items-center justify-center transition-colors z-10"
                onClick={() => setSelectedDoctor(null)}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 aspect-square relative bg-surface-gray">
                  <Image src={selectedDoctor.img} alt={selectedDoctor.name} fill className="object-cover" unoptimized />
                </div>
                <div className="md:w-3/5 p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <span className="bg-evidence-blue-light text-clinical-navy text-[11px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {selectedDoctor.specialty}
                      </span>
                      <h3 className="font-headline-md text-base font-semibold text-clinical-navy mt-2">{selectedDoctor.name}</h3>
                      <p className="text-healing-teal text-xs font-medium mt-0.5">{selectedDoctor.role}</p>
                    </div>
                    <p className="text-on-surface-variant text-xs leading-relaxed">{selectedDoctor.description}</p>
                    <div className="flex items-center gap-2 text-xs text-clinical-navy bg-surface-container-low p-2.5 rounded-lg border border-surface-gray">
                      <Briefcase className="text-healing-teal size-3.5" aria-hidden="true" />
                      <span>Experience: {selectedDoctor.experience}</span>
                    </div>
                  </div>
                  <Link
                    href={`/directory?doctor=${encodeURIComponent(selectedDoctor.name)}`}
                    className="bg-clinical-navy text-on-primary text-center text-xs font-medium py-2.5 rounded-lg hover:bg-primary-container transition-all shadow-sm mt-2"
                    onClick={() => setSelectedDoctor(null)}
                  >
                    Schedule Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Latest News Section */}
        <LatestNewsClient />

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-b from-white to-evidence-blue-light/20 border-y border-surface-gray/50">
          <div className="max-w-7xl mx-auto px-6 md:px-16 text-center space-y-5">
            <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-text-medical-black text-balance">Ready to begin your clinical journey?</h2>
            <p className="font-body-lg text-sm text-on-surface-variant/80 max-w-xl mx-auto">Schedule a comprehensive evaluation or refer a patient &mdash; we&apos;re here for both.</p>
            <div className="flex justify-center gap-3 pt-1 flex-wrap">
              <Link href="/directory" className="bg-clinical-navy text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-primary-container transition-all shadow-sm">
                Secure an Appointment
              </Link>
              <Link href="/doctor" className="border border-clinical-navy/20 text-clinical-navy text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-evidence-blue-light transition-all">
                Refer a Patient
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="bg-clinical-navy w-full border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 md:px-16 py-12 text-on-primary">
          <div className="space-y-3">
            <div className="font-headline-md text-xl font-bold text-white">Dr Bubal Care</div>
            <p className="text-white/80 max-w-xs text-xs leading-relaxed">Delivering uncompromising medical excellence and evidence-based guidance to patients globally.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-label-md text-xs text-white uppercase tracking-wider opacity-60 font-semibold">Clinical Navigation</h4>
            <div className="flex flex-col space-y-1.5">
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#home">Home</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#services">Services</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#about">About</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#doctors">Doctors</a>
              <Link className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="/news">News</Link>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#contact">Contact</a>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-label-md text-xs text-white uppercase tracking-wider opacity-60 font-semibold">Legal &amp; Privacy</h4>
            <div className="flex flex-col space-y-1.5">
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#">Privacy Policy</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#">Terms & Conditions</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#">Patient Rights</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center">
          <p className="text-white/60 text-xs">© 2026 Dr Bubal Care. Evidence-based medical excellence.</p>
        </div>
      </footer>
    </div>
  );
}
