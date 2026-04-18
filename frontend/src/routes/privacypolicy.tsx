import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacypolicy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="bg-[#242424] text-white min-h-screen flex flex-col">
      <div className="mx-auto max-w-[1000px] p-4 sm:p-6 leading-relaxed">
        <h1 className="text-2xl font-bold sm:mt-10 mb-2">
          Privacy Policy for FinSight
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Last Updated: March 17, 2026
        </p>
        <p className="mb-6">
          FinSight (“we”, “us”, or “our”) is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, store, and
          disclose your information when you use the FinSight application,
          website, and related services (collectively, the “Service”). By using
          the Service, you agree to the collection and use of information in
          accordance with this Privacy Policy.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h2>
        <h3 className="font-semibold mt-4 mb-1">a. Account Information</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Username</li>
          <li>Email address</li>
          <li>
            Password (stored securely using hashing; we do not store plaintext
            passwords)
          </li>
        </ul>
        <h3 className="font-semibold mt-4 mb-1">b. Financial Information</h3>
        <p className="mb-3">
          You may voluntarily provide financial data, including:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Income items</li>
          <li>Expenditures</li>
          <li>Assets</li>
          <li>Liabilities</li>
          <li>Financial goals</li>
        </ul>
        <h3 className="font-semibold mt-4 mb-1">c. Usage Data</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Pages visited</li>
          <li>Features used</li>
          <li>Timestamps and session activity</li>
          <li>Device and browser information</li>
        </ul>
        <h3 className="font-semibold mt-4 mb-1">d. Technical Data</h3>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>IP address</li>
          <li>Device type</li>
          <li>Operating system</li>
          <li>Browser type</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>Provide, operate, and maintain the Service</li>
          <li>Authenticate users and manage accounts</li>
          <li>Generate financial summaries and recommendations</li>
          <li>Improve and optimize the Service</li>
          <li>Monitor usage and detect security issues</li>
          <li>Communicate with you</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. AI-Generated Recommendations
        </h2>
        <p className="mb-3">
          If you choose to generate AI-based recommendations:
        </p>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>
            Your financial inputs may be processed to generate personalized
            outputs
          </li>
          <li>These outputs may be inaccurate or incomplete</li>
          <li>We do not guarantee correctness or completeness</li>
        </ul>
        <p className="mb-5">
          We do not use your personal financial data to train public AI models
          unless explicitly stated.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Data Storage and Security
        </h2>
        <p className="mb-3">We implement reasonable safeguards including:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Password hashing and authentication mechanisms</li>
          <li>Secure database storage via third-party providers</li>
          <li>Access controls</li>
        </ul>
        <p className="mb-5">
          No method of transmission or storage is 100% secure and we cannot
          guarantee absolute security.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          5. Data Sharing and Disclosure
        </h2>
        <p className="mb-3">We do not sell your personal data.</p>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>Service providers necessary to operate the Service</li>
          <li>Legal obligations or law enforcement requests</li>
          <li>Protection of rights, safety, and security</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Data Retention</h2>
        <p className="mb-5">
          We retain your information for as long as your account is active or as
          necessary to provide the Service. You may request deletion of your
          data by contacting us.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Your Rights</h2>
        <ul className="list-disc pl-6 mb-5 space-y-1">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent to processing</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          8. Cookies and Tracking Technologies
        </h2>
        <p className="mb-5">
          We may use cookies or similar technologies to maintain sessions,
          improve user experience, and analyze usage. You can control cookies
          through your browser settings.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          9. Third-Party Services
        </h2>
        <p className="mb-5">
          We may rely on third-party providers for hosting and infrastructure.
          These providers process data on our behalf and are required to protect
          it. We are not responsible for their independent practices.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">10. Contact Us</h2>
        <p className="mb-5">
          If you have any questions or requests regarding this Privacy Policy,
          please contact us at:
          <br />
          capyapp8@gmail.com
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          11. Changes to This Privacy Policy
        </h2>
        <p className="mb-5">
          We may update this Privacy Policy from time to time. Continued use of
          the Service after changes constitutes acceptance of the updated
          policy.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          12. International Users
        </h2>
        <p className="mb-5">
          Your information may be transferred to and processed in countries
          outside your jurisdiction. By using the Service, you consent to such
          transfers.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          13. Children’s Privacy
        </h2>
        <p className="mb-10">
          The Service is not intended for individuals under 18. We do not
          knowingly collect data from children and will delete such data if
          discovered.
        </p>
      </div>
    </div>
  );
}
