import React from 'react';
import { CheckCircle, MapPin, Clock, Users, Wifi, Coffee } from 'lucide-react';

const WorkspaceGuide = () => {
  const guideSteps = [
    {
      step: 1,
      title: 'Choose Your Workspace Type',
      description: 'Understand different workspace options and find what suits your needs',
      details: [
        'Hot Desk: Flexible seating in open areas',
        'Dedicated Desk: Your own reserved workspace',
        'Private Office: Enclosed space for teams',
        'Meeting Rooms: Professional spaces for presentations'
      ]
    },
    {
      step: 2,
      title: 'Select Location & Amenities',
      description: 'Find the perfect location with the amenities you need',
      details: [
        'Check proximity to metro stations and parking',
        'Verify high-speed internet availability',
        'Look for essential amenities like printing and coffee',
        'Consider additional perks like gym access or events'
      ]
    },
    {
      step: 3,
      title: 'Book Your Space',
      description: 'Complete your booking with our simple process',
      details: [
        'Select your preferred dates and times',
        'Add guest count and special requirements',
        'Review pricing and cancellation policies',
        'Complete secure payment and get confirmation'
      ]
    },
    {
      step: 4,
      title: 'Prepare for Your Visit',
      description: 'Get ready for a productive workspace experience',
      details: [
        'Bring valid ID for check-in',
        'Pack your laptop, chargers, and work materials',
        'Review workspace rules and guidelines',
        'Arrive 10 minutes early for smooth check-in'
      ]
    }
  ];

  const workspaceTypes = [
    {
      type: 'Hot Desk',
      price: '₹300-500/hour',
      icon: <Users className="w-8 h-8" />,
      features: ['Flexible seating', 'Shared amenities', 'Networking opportunities', 'Cost-effective'],
      bestFor: 'Freelancers, remote workers, short-term projects'
    },
    {
      type: 'Dedicated Desk',
      price: '₹800-1200/day',
      icon: <MapPin className="w-8 h-8" />,
      features: ['Reserved workspace', 'Storage space', 'Consistent setup', 'Personal touches'],
      bestFor: 'Regular remote workers, consultants, small teams'
    },
    {
      type: 'Private Office',
      price: '₹2000-4000/day',
      icon: <Coffee className="w-8 h-8" />,
      features: ['Complete privacy', 'Team collaboration', 'Custom setup', 'Meeting space'],
      bestFor: 'Startups, established teams, confidential work'
    },
    {
      type: 'Meeting Room',
      price: '₹500-1000/hour',
      icon: <Clock className="w-8 h-8" />,
      features: ['Professional setting', 'AV equipment', 'Whiteboard', 'Video conferencing'],
      bestFor: 'Client meetings, presentations, team discussions'
    }
  ];

  const tips = [
    {
      category: 'Booking Tips',
      items: [
        'Book in advance for popular locations and times',
        'Check cancellation policies before confirming',
        'Consider package deals for regular bookings',
        'Read reviews from other users'
      ]
    },
    {
      category: 'Productivity Tips',
      items: [
        'Choose quiet areas for focused work',
        'Use noise-canceling headphones in open spaces',
        'Take advantage of networking opportunities',
        'Utilize break areas for mental refreshment'
      ]
    },
    {
      category: 'Etiquette Tips',
      items: [
        'Keep noise levels considerate of others',
        'Clean up after yourself',
        'Respect shared equipment and spaces',
        'Be mindful of phone call volumes'
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Workspace Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about finding, booking, and making the most of your workspace experience with PickMyDesk.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guideSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-700">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {step.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Workspace Types</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {workspaceTypes.map((workspace, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    {workspace.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{workspace.type}</h3>
                    <p className="text-purple-600 font-medium">{workspace.price}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {workspace.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Best For:</h4>
                  <p className="text-sm text-gray-600">{workspace.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips & Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Tips & Best Practices</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {tips.map((tipCategory, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-700">{tipCategory.category}</h3>
                <ul className="space-y-3">
                  {tipCategory.items.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Common Amenities */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Common Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            {[
              { icon: <Wifi className="w-8 h-8" />, name: 'High-Speed WiFi' },
              { icon: <Coffee className="w-8 h-8" />, name: 'Coffee & Tea' },
              { icon: <Users className="w-8 h-8" />, name: 'Meeting Rooms' },
              { icon: <MapPin className="w-8 h-8" />, name: 'Prime Location' },
              { icon: <Clock className="w-8 h-8" />, name: '24/7 Access' },
              { icon: <CheckCircle className="w-8 h-8" />, name: 'Security' }
            ].map((amenity, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg shadow-md mb-2">
                  {amenity.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-purple-700 rounded-lg text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Workspace?</h2>
          <p className="text-purple-100 mb-6">
            Browse hundreds of verified workspaces across India and book your ideal space in minutes.
          </p>
          <a
            href="/"
            className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Explore Workspaces
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceGuide;
