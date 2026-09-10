import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Dr Bubal Care collects, uses, stores, and protects your personal and health information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-6 md:px-16 py-16 md:py-24">
        <Link
          href="/"
          className="text-sm font-medium text-[#1E3A5F] hover:text-[#1E3A5F] transition-colors"
        >
          ← Back to home
        </Link>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#0F172A] mt-6 mb-8 tracking-tight">
          Privacy Policy
        </h1>
        <div className="prose prose-slate max-w-none text-[#64748B]">
          <p className="text-sm text-[#64748B]/70 mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              1. Introduction
            </h2>
            <p>
              Dr Bubal Care (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our telehealth and diagnostic coordination
              platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              2. Information We Collect
            </h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Account information:</strong> name, email address, phone number, country of
                residence, and password.
              </li>
              <li>
                <strong>Health information:</strong> medical records, lab results, imaging studies,
                biopsy slides, symptoms, and clinical histories you upload for review by the
                physicians in our Global Doctors Network.
              </li>
              <li>
                <strong>Payment information:</strong> processed securely by our payment providers.
                We do not store full payment card details.
              </li>
              <li>
                <strong>Communications:</strong> messages you send to our support team or to the
                physicians reviewing your case through the platform.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              3. How We Use Your Information
            </h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                Provide expert medical opinions and diagnostic coordination services through our
                Global Doctors Network.
              </li>
              <li>Match your case with an appropriate board-certified physician in our network.</li>
              <li>Process payments and maintain your account.</li>
              <li>Communicate with you about your cases, reports, and platform updates.</li>
              <li>Improve our services and ensure platform security.</li>
              <li>Comply with legal and regulatory obligations.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              4. Data Storage and Security
            </h2>
            <p>
              We use industry-standard encryption for data in transit (TLS 1.3) and at rest. File
              uploads use signed, short-lived URLs. Access to protected health information is
              restricted to verified physicians in our Global Doctors Network and authorized
              personnel who need it to perform their roles.
            </p>
            <p className="mt-3">
              We partner with SOC 2 Type II certified infrastructure providers. While we take
              reasonable steps to protect your data, no internet-based service can guarantee absolute
              security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              5. Information Sharing
            </h2>
            <p>We do not sell your personal or health information. We may share information with:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Board-certified physicians in our Global Doctors Network</strong> who review
                your case.
              </li>
              <li>
                <strong>Service providers</strong> who help us operate the platform (cloud hosting,
                payment processing, analytics), under strict confidentiality agreements.
              </li>
              <li>
                <strong>Legal authorities</strong> when required by law, court order, or to protect
                rights and safety.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              6. Your Rights
            </h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, or restrict
              processing of your personal data. To exercise these rights, contact us at{" "}
              <a
                href="mailto:care@drbubalcare.com"
                className="text-[#1E3A5F] hover:text-[#1E3A5F]"
              >
                care@drbubalcare.com
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              7. Cookies and Tracking
            </h2>
            <p>
              We use essential cookies to maintain your session and secure the platform. We do not use
              cookies for advertising or third-party tracking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by posting the updated policy on this page with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              9. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a
                href="mailto:care@drbubalcare.com"
                className="text-[#1E3A5F] hover:text-[#1E3A5F]"
              >
                care@drbubalcare.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
