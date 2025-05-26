import React, { useState } from 'react';
import { MapPin, Star, Clock, Wifi, Coffee, Car } from 'lucide-react';

const CityGuides = () => {
  const [selectedCity, setSelectedCity] = useState('delhi');

  const cities = [
    {
      id: 'delhi',
      name: 'Delhi',
      description: 'India\'s capital and political hub',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400',
      workspaces: 150,
      avgPrice: '₹400-800/hour'
    },
    {
      id: 'mumbai',
      name: 'Mumbai',
      description: 'Financial capital of India',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400',
      workspaces: 200,
      avgPrice: '₹500-1000/hour'
    },
    {
      id: 'bangalore',
      name: 'Bangalore',
      description: 'Silicon Valley of India',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400',
      workspaces: 180,
      avgPrice: '₹350-750/hour'
    },
    {
      id: 'pune',
      name: 'Pune',
      description: 'IT and education hub',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
      workspaces: 120,
      avgPrice: '₹300-600/hour'
    }
  ];

  const cityDetails = {
    delhi: {
      areas: [
        { name: 'Connaught Place', spaces: 25, type: 'Business District', metro: 'Yes' },
        { name: 'Gurgaon', spaces: 40, type: 'Corporate Hub', metro: 'Yes' },
        { name: 'Noida', spaces: 30, type: 'IT Sector', metro: 'Yes' },
        { name: 'Karol Bagh', spaces: 20, type: 'Commercial Area', metro: 'Yes' }
      ],
      highlights: [
        'Excellent metro connectivity',
        'Government and corporate offices',
        'Rich cultural heritage',
        'Diverse food scene'
      ],
      tips: [
        'Book early during parliament sessions',
        'Consider traffic during peak hours',
        'Many spaces offer government meeting facilities',
        'Great for networking with policy makers'
      ]
    },
    mumbai: {
      areas: [
        { name: 'Bandra Kurla Complex', spaces: 35, type: 'Financial District', metro: 'No' },
        { name: 'Lower Parel', spaces: 30, type: 'Corporate Hub', metro: 'Yes' },
        { name: 'Andheri', spaces: 45, type: 'IT Corridor', metro: 'Yes' },
        { name: 'Fort', spaces: 25, type: 'Heritage Business', metro: 'Yes' }
      ],
      highlights: [
        'Financial capital of India',
        'Bollywood and entertainment industry',
        'Excellent local train network',
        'Vibrant startup ecosystem'
      ],
      tips: [
        'Local trains are fastest during peak hours',
        'Book spaces near stations for easy access',
        'Many spaces offer sea views',
        'Great for fintech and media networking'
      ]
    },
    bangalore: {
      areas: [
        { name: 'Electronic City', spaces: 50, type: 'IT Hub', metro: 'Yes' },
        { name: 'Whitefield', spaces: 40, type: 'Tech Corridor', metro: 'No' },
        { name: 'Koramangala', spaces: 35, type: 'Startup District', metro: 'No' },
        { name: 'Indiranagar', spaces: 25, type: 'Creative Quarter', metro: 'Yes' }
      ],
      highlights: [
        'India\'s Silicon Valley',
        'Pleasant weather year-round',
        'Thriving startup ecosystem',
        'Excellent pub and cafe culture'
      ],
      tips: [
        'Traffic can be heavy, plan accordingly',
        'Many spaces offer late-night access',
        'Great for tech networking events',
        'Consider weather during monsoon'
      ]
    },
    pune: {
      areas: [
        { name: 'Koregaon Park', spaces: 30, type: 'IT Hub', metro: 'No' },
        { name: 'Hinjewadi', spaces: 35, type: 'IT City', metro: 'No' },
        { name: 'Viman Nagar', spaces: 25, type: 'Corporate Zone', metro: 'No' },
        { name: 'Camp Area', spaces: 20, type: 'Traditional Business', metro: 'No' }
      ],
      highlights: [
        'Educational and IT hub',
        'Pleasant climate',
        'Rich Marathi culture',
        'Growing startup scene'
      ],
      tips: [
        'Two-wheeler friendly city',
        'Many spaces near educational institutions',
        'Great for ed-tech and automotive networking',
        'Consider monsoon season for planning'
      ]
    }
  };

  const currentCity = cities.find(city => city.id === selectedCity);
  const currentDetails = cityDetails[selectedCity];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            City Workspace Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the best workspaces in India's major business cities. 
            Find local insights, pricing, and recommendations for each location.
          </p>
        </div>

        {/* City Selection */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`text-left p-4 rounded-lg transition-all ${
                selectedCity === city.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white hover:shadow-md'
              }`}
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-lg mb-1">{city.name}</h3>
              <p className={`text-sm mb-2 ${selectedCity === city.id ? 'text-purple-100' : 'text-gray-600'}`}>
                {city.description}
              </p>
              <div className="flex justify-between text-sm">
                <span>{city.workspaces} spaces</span>
                <span>{city.avgPrice}</span>
              </div>
            </button>
          ))}
        </div>

        {/* City Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Areas */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Areas in {currentCity.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {currentDetails.areas.map((area, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{area.name}</h3>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                      {area.spaces} spaces
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{area.type}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Metro: {area.metro}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* City Highlights */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Why Choose {currentCity.name}?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {currentDetails.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips & Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Local Tips</h3>
              <ul className="space-y-3">
                {currentDetails.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Workspaces</span>
                  <span className="font-semibold">{currentCity.workspaces}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Price</span>
                  <span className="font-semibold">{currentCity.avgPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Popular Amenities</span>
                  <div className="flex space-x-2">
                    <Wifi className="w-4 h-4 text-blue-500" />
                    <Coffee className="w-4 h-4 text-brown-500" />
                    <Car className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-purple-700 rounded-lg text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book in {currentCity.name}?</h2>
          <p className="text-purple-100 mb-6">
            Explore available workspaces in {currentCity.name} and book your perfect space today.
          </p>
          <a
            href="/"
            className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Browse {currentCity.name} Workspaces
          </a>
        </div>
      </div>
    </div>
  );
};

export default CityGuides;
