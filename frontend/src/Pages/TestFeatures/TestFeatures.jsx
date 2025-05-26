import React from 'react';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { formatPrice } from '../../utils/currency';

const TestFeatures = () => {
  const features = [
    {
      category: "🏢 Branding & Identity",
      items: [
        { name: "Project renamed to 'SpaceBook'", status: "completed", test: "Check page title and navigation" },
        { name: "Professional background images", status: "completed", test: "Visible on all pages" },
        { name: "Consistent branding throughout", status: "completed", test: "Logo and name updated" }
      ]
    },
    {
      category: "🇮🇳 Indian Localization",
      items: [
        { name: "Indian workspace locations", status: "completed", test: "Delhi, Mumbai, Pune, Bangalore" },
        { name: "INR currency display", status: "completed", test: `${formatPrice(1500, 'INR')} format` },
        { name: "Indian phone numbers (+91)", status: "completed", test: "Default country code in forms" },
        { name: "Realistic Indian pricing", status: "completed", test: "₹300-2500 range" }
      ]
    },
    {
      category: "📱 Enhanced Forms",
      items: [
        { name: "International phone input", status: "completed", test: "Country code dropdown" },
        { name: "Image upload functionality", status: "completed", test: "File upload in workspace creation" },
        { name: "Improved validation", status: "completed", test: "Better error messages" },
        { name: "Currency formatting", status: "completed", test: "Indian number format (₹1,00,000)" }
      ]
    },
    {
      category: "📄 Essential Pages",
      items: [
        { name: "About page", status: "completed", test: "/about" },
        { name: "Contact page", status: "completed", test: "/contact with working form" },
        { name: "FAQ page", status: "completed", test: "/faq with searchable content" },
        { name: "Privacy Policy", status: "completed", test: "/privacy" },
        { name: "Terms of Service", status: "completed", test: "/terms" }
      ]
    },
    {
      category: "🔗 Navigation & Links",
      items: [
        { name: "Working footer links", status: "completed", test: "All footer links functional" },
        { name: "Social media links", status: "completed", test: "External links to social platforms" },
        { name: "Proper routing", status: "completed", test: "All pages accessible" },
        { name: "Mobile-friendly navigation", status: "completed", test: "Responsive design" }
      ]
    },
    {
      category: "💰 Currency & Pricing",
      items: [
        { name: "INR in workspace cards", status: "completed", test: "Homepage workspace pricing" },
        { name: "INR in booking form", status: "completed", test: "Booking flow pricing" },
        { name: "INR in workspace details", status: "completed", test: "Individual workspace pages" },
        { name: "INR in booking history", status: "completed", test: "User bookings page" }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <div className="w-5 h-5 rounded-full bg-yellow-500" />;
      case 'pending':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />;
    }
  };

  const testLinks = [
    { name: "Homepage", url: "/", description: "Test workspace cards with INR pricing" },
    { name: "About Page", url: "/about", description: "Company information and mission" },
    { name: "Contact Page", url: "/contact", description: "Contact form and information" },
    { name: "FAQ Page", url: "/faq", description: "Searchable frequently asked questions" },
    { name: "Create Workspace", url: "/create-workspace", description: "Test image upload functionality" },
    { name: "Signup", url: "/signup", description: "Test phone number input with country codes" }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 SpaceBook Feature Testing
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive testing dashboard for all implemented features
          </p>
        </div>

        {/* Feature Status Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {features.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.test}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Test Links */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Quick Test Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{link.name}</h3>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">{link.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Currency Test */}
        <div className="mt-8 bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-4">💰 Currency Formatting Test</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{formatPrice(300, 'INR')}</div>
              <div className="text-sm text-gray-600">Hourly Rate</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{formatPrice(1500, 'INR')}</div>
              <div className="text-sm text-gray-600">Daily Rate</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{formatPrice(25000, 'INR')}</div>
              <div className="text-sm text-gray-600">Monthly Rate</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{formatPrice(100000, 'INR')}</div>
              <div className="text-sm text-gray-600">Premium Rate</div>
            </div>
          </div>
        </div>

        {/* Social Media Test */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">📱 Social Media Links Test</h3>
          <div className="flex space-x-4">
            <a href="https://instagram.com/spacebook.in" target="_blank" rel="noopener noreferrer" 
               className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              Instagram
            </a>
            <a href="https://facebook.com/spacebook.in" target="_blank" rel="noopener noreferrer"
               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Facebook
            </a>
            <a href="https://twitter.com/spacebook_in" target="_blank" rel="noopener noreferrer"
               className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500">
              Twitter
            </a>
            <a href="https://youtube.com/@spacebook" target="_blank" rel="noopener noreferrer"
               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestFeatures;
