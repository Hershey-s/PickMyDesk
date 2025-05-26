import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      category: "Booking & Reservations",
      questions: [
        {
          q: "How do I book a workspace on SpaceBook?",
          a: "Simply browse available workspaces, select your preferred location and time, fill out the booking form with your details, and confirm your reservation. You'll receive a confirmation email with all the details."
        },
        {
          q: "Can I cancel or modify my booking?",
          a: "Yes, you can cancel or modify your booking up to 24 hours before your scheduled time. Go to 'My Bookings' in your account to make changes. Cancellation policies may vary by workspace."
        },
        {
          q: "How far in advance can I book a workspace?",
          a: "You can book workspaces up to 3 months in advance. For same-day bookings, you can reserve a space up to 2 hours before your intended start time."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our encrypted payment gateway."
        }
      ]
    },
    {
      category: "Pricing & Payments",
      questions: [
        {
          q: "How is pricing calculated?",
          a: "Pricing varies by location, amenities, and duration. Most workspaces offer hourly and daily rates. You'll see the exact price before confirming your booking, including any applicable taxes."
        },
        {
          q: "Are there any hidden fees?",
          a: "No hidden fees! The price you see during booking is the final price you pay. This includes all basic amenities like WiFi, power, and seating."
        },
        {
          q: "Do you offer discounts for long-term bookings?",
          a: "Yes, many workspace providers offer discounts for weekly or monthly bookings. You'll see these discounted rates automatically applied during the booking process."
        },
        {
          q: "What's your refund policy?",
          a: "Refunds are processed according to the cancellation policy of each workspace. Generally, cancellations made 24+ hours in advance receive full refunds, while later cancellations may incur charges."
        }
      ]
    },
    {
      category: "Workspace Features",
      questions: [
        {
          q: "What amenities are included?",
          a: "Basic amenities include high-speed WiFi, power outlets, comfortable seating, and access to common areas. Premium locations may include printing, coffee, meeting rooms, and phone booths."
        },
        {
          q: "Can I use meeting rooms?",
          a: "Meeting room access depends on your booking type and the specific workspace. Some include meeting room access, while others offer it as an add-on. Check the workspace details before booking."
        },
        {
          q: "Is parking available?",
          a: "Parking availability varies by location. Each workspace listing shows whether parking is available and if there are any additional charges. Many locations in metro areas offer paid parking."
        },
        {
          q: "Can I bring guests?",
          a: "Guest policies vary by workspace. When booking, you can specify the number of guests. Some locations charge per person, while others include a certain number of guests in the base price."
        }
      ]
    },
    {
      category: "Account & Support",
      questions: [
        {
          q: "Do I need to create an account to book?",
          a: "Yes, creating an account helps us manage your bookings, send confirmations, and provide better customer service. It only takes a minute to sign up."
        },
        {
          q: "How do I contact customer support?",
          a: "You can reach our support team via email at support@spacebook.in, call us at +91 98765 43210, or use the contact form on our website. We respond within 24 hours."
        },
        {
          q: "Can I get a receipt for my booking?",
          a: "Yes, you'll automatically receive a receipt via email after payment. You can also download receipts from your 'My Bookings' section for expense reporting."
        },
        {
          q: "What if I have issues during my booking?",
          a: "Contact our support team immediately if you encounter any issues. We're available during business hours and will work with the workspace provider to resolve any problems quickly."
        }
      ]
    }
  ];

  const toggleItem = (category, index) => {
    const key = `${category}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about SpaceBook. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQ.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-purple-50 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((item, index) => {
                  const key = `${category.category}-${index}`;
                  const isOpen = openItems[key];
                  
                  return (
                    <div key={index}>
                      <button
                        onClick={() => toggleItem(category.category, index)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900 pr-4">{item.q}</h3>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-purple-700 rounded-lg text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-purple-100 mb-6">
            Our support team is here to help you with any questions about SpaceBook
          </p>
          <a
            href="/contact"
            className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
