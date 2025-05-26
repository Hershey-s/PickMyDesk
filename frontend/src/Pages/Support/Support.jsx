import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, Search, HelpCircle } from 'lucide-react';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const supportCategories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'booking', name: 'Booking Issues', icon: MessageCircle },
    { id: 'payment', name: 'Payment & Billing', icon: Mail },
    { id: 'technical', name: 'Technical Support', icon: Phone },
    { id: 'account', name: 'Account Management', icon: Clock }
  ];

  const quickHelp = [
    {
      category: 'booking',
      question: 'How do I cancel my booking?',
      answer: 'Go to "My Bookings" and click the "Cancel" button next to your booking. Cancellation policies vary by workspace.'
    },
    {
      category: 'booking',
      question: 'Can I modify my booking dates?',
      answer: 'Yes, you can reschedule your booking up to 24 hours before the start time through "My Bookings".'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets.'
    },
    {
      category: 'payment',
      question: 'When will I be charged?',
      answer: 'Payment is processed immediately upon booking confirmation.'
    },
    {
      category: 'technical',
      question: 'The website is not loading properly',
      answer: 'Try clearing your browser cache, disabling ad blockers, or using a different browser.'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.'
    }
  ];

  const filteredHelp = quickHelp.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get help with your PickMyDesk experience. We're here to assist you 24/7.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Get instant help from our support team</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Speak directly with our experts</p>
            <a href="tel:+919876543210" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block">
              +91 98765 43210
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us a detailed message</p>
            <a href="mailto:support@pickmydesk.in" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 inline-block">
              Email Us
            </a>
          </div>
        </div>

        {/* Support Hours */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold">Support Hours</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-center">
            <div>
              <h4 className="font-medium">Phone & Chat Support</h4>
              <p className="text-gray-600">Monday - Friday: 9:00 AM - 9:00 PM IST</p>
              <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 6:00 PM IST</p>
            </div>
            <div>
              <h4 className="font-medium">Email Support</h4>
              <p className="text-gray-600">24/7 - We respond within 4 hours</p>
              <p className="text-gray-600">Emergency issues: Within 1 hour</p>
            </div>
          </div>
        </div>

        {/* Quick Help Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Help</h2>
          
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {supportCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Help Items */}
          <div className="space-y-4">
            {filteredHelp.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
            
            {filteredHelp.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No help articles found. Try a different search term or contact support directly.</p>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Support</h3>
          <p className="text-red-700 mb-4">
            For urgent issues affecting your current booking or safety concerns:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+919876543210"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 text-center font-medium"
            >
              Emergency Hotline: +91 98765 43210
            </a>
            <a
              href="mailto:emergency@pickmydesk.in"
              className="bg-red-100 text-red-700 px-6 py-3 rounded-lg hover:bg-red-200 text-center font-medium border border-red-300"
            >
              emergency@pickmydesk.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
