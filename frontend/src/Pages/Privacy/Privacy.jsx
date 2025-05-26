import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us. Learn how we protect and handle your data.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: January 2025
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 2025
            </p>
            <p className="text-gray-600 mb-6">
              At SpaceBook, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our workspace booking platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Name, email address, and phone number</li>
                  <li>Account credentials and profile information</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Booking history and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on our platform</li>
                  <li>Search queries and booking interactions</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>To provide and maintain our workspace booking services</li>
              <li>To process bookings and payments</li>
              <li>To communicate with you about your bookings and account</li>
              <li>To improve our platform and user experience</li>
              <li>To send promotional communications (with your consent)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>With workspace providers to facilitate your bookings</li>
              <li>With payment processors to handle transactions</li>
              <li>With service providers who assist in operating our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of promotional communications</li>
              <li>Request a copy of your data</li>
              <li>Lodge a complaint with relevant authorities</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage,
              and provide personalized content. You can control cookie settings through your browser.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@spacebook.in<br />
                <strong>Phone:</strong> +91 98765 43210<br />
                <strong>Address:</strong> SpaceBook Privacy Office, Connaught Place, New Delhi, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
