import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Patient Rights",
  description:
    "Your rights as a patient using the Dr Bubal Care diagnostic coordination platform.",
  alternates: {
    canonical: "/patient-rights",
  },
};

export default function PatientRightsPage() {
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
          Patient Rights
        </h1>
        <div className="prose prose-slate max-w-none text-[#64748B]">
          <p className="text-sm text-[#64748B]/70 mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <p className="mb-8">
            At Dr Bubal Care, we believe every patient deserves clarity, respect, and control over
            their medical information. The following rights apply to everyone who uses our platform.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              1. Right to Clear Information
            </h2>
            <p>
              You have the right to receive information about our services, pricing, expected
              turnaround times, and what you can expect from a specialist opinion before you submit a
              case or make a payment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              2. Right to Informed Consent
            </h2>
            <p>
              Before any AI-assisted processing or specialist review begins, you will be informed about
              how your data will be used. You may withdraw consent at any time by contacting support.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              3. Right to Privacy and Confidentiality
            </h2>
            <p>
              Your medical records and personal information are confidential. Only board-certified
              specialists and authorized personnel involved in your case may access your information.
              We use encryption, access controls, and audit logging to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              4. Right to Access Your Records
            </h2>
            <p>
              You can access your uploaded files, case history, and specialist opinions at any time
              through your patient dashboard. If you need a copy in a different format, contact our
              support team.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              5. Right to Request Corrections
            </h2>
            <p>
              If you believe information in your profile or case records is inaccurate, you may request
              corrections. Corrections to medical interpretations should be directed to the specialist
              who provided the opinion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              6. Right to a Second or Peer Review
            </h2>
            <p>
              If you are not satisfied with an opinion, you may request a peer review by another
              qualified specialist. Peer reviews are available at no additional cost when the request is
              made within 14 days of receiving the original opinion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              7. Right to Timely Communication
            </h2>
            <p>
              We aim to deliver specialist opinions within 24–48 hours for standard cases. If a delay
              is expected, you will be notified with a revised timeline and the reason for the delay.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              8. Right to Non-Discrimination
            </h2>
            <p>
              We provide services without discrimination based on age, gender, race, ethnicity,
              religion, nationality, disability, or socioeconomic status. If you feel you have been
              treated unfairly, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              9. Right to Data Deletion
            </h2>
            <p>
              You may request deletion of your account and personal data, subject to legal and
              regulatory retention requirements. Medical records may be retained for the period required
              by applicable law even after account closure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              10. Right to Raise Concerns
            </h2>
            <p>
              If you have a complaint about your care, data handling, or platform experience, you may
              contact our support team. We will acknowledge your concern within 48 hours and work to
              resolve it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              Contact Us
            </h2>
            <p>
              For questions about your rights, email{" "}
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
