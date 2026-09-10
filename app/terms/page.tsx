import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms and conditions governing your use of the Dr Bubal Care platform.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
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
          Terms of Use
        </h1>
        <div className="prose prose-slate max-w-none text-[#64748B]">
          <p className="text-sm text-[#64748B]/70 mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Dr Bubal Care platform, you agree to these Terms of Use and
              our Privacy Policy. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              2. Medical Disclaimer
            </h2>
            <p>
              Dr Bubal Care provides a coordination service that connects patients with
              board-certified physicians in our Global Doctors Network for written opinions. The
              opinions provided through our platform are educational and informational and do not
              replace a direct relationship between you and a qualified healthcare provider.
            </p>
            <p className="mt-3">
              <strong>Do not use our service in a medical emergency.</strong> If you are experiencing
              a life-threatening condition, call your local emergency services or go to the nearest
              emergency room immediately.
            </p>
            <p className="mt-3">
              The physicians in our Global Doctors Network do not diagnose, prescribe medication,
              or provide treatment plans through the platform. Always consult your local physician
              or specialist before making medical decisions based on information received through
              the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              3. Eligibility and Account Registration
            </h2>
            <p>
              You must be at least 18 years old to create an account. By registering, you represent
              that you are the patient or have legal authority to act on the patient&apos;s behalf.
              You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              4. Services and Payments
            </h2>
            <p>
              Prices for services are displayed before you confirm a case. Payment is collected at the
              time of submission. We reserve the right to modify pricing at any time, but changes
              will not affect cases already paid for.
            </p>
            <p className="mt-3">
              Refunds may be issued when a case cannot be matched to a suitable physician in our
              Global Doctors Network or when the uploaded materials are insufficient for review.
              See our refund policy for details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              5. User Responsibilities
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Provide accurate, complete, and truthful information.</li>
              <li>Upload only records and images you have the right to share.</li>
              <li>Use the platform only for lawful purposes.</li>
              <li>Not attempt to circumvent security measures or access data belonging to other users.</li>
              <li>Not harass, threaten, or abuse the physicians of our Global Doctors Network or our staff.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              6. Intellectual Property
            </h2>
            <p>
              All content, branding, software, and materials on the platform are owned by Dr Bubal
              Care or its licensors. You may not copy, modify, distribute, or reverse-engineer any
              part of the platform without our written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Dr Bubal Care and its affiliates, officers,
              employees, and the physicians of our Global Doctors Network are not liable for
              indirect, incidental, or consequential damages arising from your use of the platform.
              Our total liability is limited to the amount you paid for the specific service at issue.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              8. Termination
            </h2>
            <p>
              We may suspend or terminate your account if you violate these Terms, engage in fraudulent
              activity, or create risk or legal exposure for us. You may close your account at any time
              by contacting support.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              9. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of Belgium, without regard to conflict of law
              principles. Disputes will be resolved in the courts of Ghent, Belgium.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-3">
              10. Contact Us
            </h2>
            <p>
              For questions about these Terms, please contact{" "}
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
