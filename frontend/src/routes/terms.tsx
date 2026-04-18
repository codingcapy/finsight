import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="bg-[#242424] text-white min-h-screen flex flex-col">
      <div className="mx-auto max-w-[1000px] p-4 sm:p-6 leading-relaxed">
        <h1 className="text-2xl font-bold sm:mt-10 mb-2">
          Terms and Conditions for FinSight
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Last Updated: March 17, 2026
        </p>
        <p className="mb-6">
          Welcome to FinSight. These Terms and Conditions (“Terms”) govern your
          use of the FinSight application, website, and related services
          (collectively, the “Service”). By accessing or using the Service, you
          agree to be bound by these Terms.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Eligibility</h2>
        <p className="mb-5">
          You must be at least 18 years old (or the age of majority in your
          jurisdiction) to use this Service. By using FinSight, you represent
          and warrant that you meet this requirement.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. Account Registration and Security
        </h2>
        <p className="mb-3">
          To use certain features of the Service, you must create an account
          using a username, email address, and password.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            You are responsible for maintaining the confidentiality of your
            login credentials.
          </li>
          <li>
            You agree to provide accurate and complete information during
            registration.
          </li>
          <li>
            You are responsible for all activities that occur under your
            account.
          </li>
          <li>
            You must notify us immediately of any unauthorized use of your
            account.
          </li>
        </ul>
        <p className="mb-5">
          We implement reasonable security measures, including password hashing
          and authentication mechanisms, but we cannot guarantee absolute
          security.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Description of the Service
        </h2>
        <p className="mb-3">
          FinSight is a financial planning tool that allows users to:
        </p>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>Create, update, and delete financial plans</li>
          <li>
            Input financial data, including income, expenses, assets,
            liabilities, and financial goals
          </li>
          <li>
            Receive system-generated financial summaries and recommendations
          </li>
          <li>
            Optionally generate AI-based financial recommendations based on
            provided inputs
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Financial Disclaimer
        </h2>
        <p className="mb-3">
          FinSight provides informational and educational content only.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            The recommendations (both predetermined and AI-generated) are not
            financial, legal, or tax advice.
          </li>
          <li>
            The Service does not consider your full financial situation or
            personal circumstances.
          </li>
          <li>
            You should consult a qualified financial professional before making
            any financial decisions.
          </li>
        </ul>
        <p className="mb-2">
          By using this Service, you acknowledge and agree that:
        </p>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>You are solely responsible for your financial decisions.</li>
          <li>
            FinSight is not liable for any outcomes resulting from your reliance
            on the recommendations.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          5. AI-Generated Content
        </h2>
        <p className="mb-3">
          FinSight may provide recommendations generated using artificial
          intelligence.
        </p>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>
            AI-generated outputs may be inaccurate, incomplete, or outdated.
          </li>
          <li>These outputs are provided “as is” without any warranties.</li>
          <li>
            You agree not to rely solely on AI-generated content for financial
            decision-making.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          6. User Data and Inputs
        </h2>
        <p className="mb-3">
          You retain ownership of the data you input into the Service, including
          financial information.
        </p>
        <p className="mb-2">
          By using FinSight, you grant us a limited license to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            Store and process your data for the purpose of providing the Service
          </li>
          <li>Generate recommendations based on your inputs</li>
        </ul>
        <p className="mb-2">You agree:</p>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>Not to input false, misleading, or unlawful information</li>
          <li>Not to use the Service for fraudulent or illegal purposes</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          7. Data Storage and Privacy
        </h2>
        <p className="mb-5">
          Your data is stored securely using third-party infrastructure
          providers. While we take reasonable precautions to protect your data,
          you acknowledge that no system is completely secure and we cannot
          guarantee absolute protection against unauthorized access.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">8. Prohibited Use</h2>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>Use the Service for any unlawful purpose</li>
          <li>
            Attempt to gain unauthorized access to the system or other users’
            accounts
          </li>
          <li>
            Reverse engineer, decompile, or exploit any part of the Service
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the
            Service
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">9. Termination</h2>
        <p className="mb-5">
          We reserve the right to suspend or terminate your account at our
          discretion if you violate these Terms or engage in harmful behavior.
          You may also terminate your account at any time.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          10. Limitation of Liability
        </h2>
        <p className="mb-5">
          To the fullest extent permitted by law, FinSight and its operators
          shall not be liable for any indirect, incidental, or consequential
          damages, including financial losses or decisions made based on
          recommendations provided by the Service.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">11. No Warranty</h2>
        <p className="mb-5">
          The Service is provided on an “as is” and “as available” basis without
          warranties of any kind, including accuracy, reliability, or fitness
          for a particular purpose.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          12. Changes to the Service
        </h2>
        <p className="mb-5">
          We reserve the right to modify, suspend, or discontinue any part of
          the Service at any time without notice.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          13. Changes to These Terms
        </h2>
        <p className="mb-5">
          We may update these Terms from time to time. Continued use of the
          Service after changes constitutes acceptance of the updated Terms.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">14. Governing Law</h2>
        <p className="mb-5">
          These Terms shall be governed by and construed in accordance with the
          laws of the applicable jurisdiction.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          15. Contact Information
        </h2>
        <p className="mb-5">
          If you have any questions about these Terms, please contact us at:
          <br />
          capyapp8@gmail.com
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">16. Acknowledgment</h2>
        <p className="mb-10">
          By using FinSight, you acknowledge that you have read, understood, and
          agree to be bound by these Terms and Conditions.
        </p>
      </div>
    </div>
  );
}
