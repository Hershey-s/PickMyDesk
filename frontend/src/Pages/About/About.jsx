import React from 'react';
import { CheckCircle, Users, MapPin, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About SpaceBook
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            India's premier workspace booking platform, connecting professionals with 
            perfect workspaces across major cities. From co-working spaces to private offices, 
            we make finding and booking your ideal workspace simple and seamless.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                To revolutionize how professionals find and book workspaces in India. 
                We believe that the right workspace can unlock productivity, creativity, 
                and success for individuals and teams.
              </p>
              <p className="text-gray-600">
                Whether you're a freelancer looking for a quiet corner, a startup 
                needing a collaborative environment, or an enterprise requiring 
                premium facilities, SpaceBook connects you with the perfect space.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-700">500+</div>
                  <div className="text-gray-600">Workspaces</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">50+</div>
                  <div className="text-gray-600">Cities</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">10K+</div>
                  <div className="text-gray-600">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose SpaceBook?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <MapPin className="w-12 h-12 text-purple-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">
                Workspaces in the heart of India's major business districts
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Clock className="w-12 h-12 text-purple-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
              <p className="text-gray-600">
                Book your workspace in minutes with our seamless platform
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Users className="w-12 h-12 text-purple-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Join a thriving community of professionals and entrepreneurs
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <CheckCircle className="w-12 h-12 text-purple-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Spaces</h3>
              <p className="text-gray-600">
                All workspaces are verified for quality and amenities
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto text-gray-600 space-y-4">
            <p>
              Founded in 2024, SpaceBook emerged from a simple observation: finding the 
              right workspace in India's bustling cities was unnecessarily complicated. 
              Our founders, having experienced the challenges of remote work and the 
              need for flexible office solutions, set out to create a platform that 
              would simplify this process.
            </p>
            <p>
              Starting in Delhi, Mumbai, Bangalore, and Pune, we've carefully curated 
              a network of premium workspaces that cater to diverse professional needs. 
              From the creative studios of Bandra to the tech hubs of Electronic City, 
              we ensure every space meets our high standards for connectivity, comfort, 
              and community.
            </p>
            <p>
              Today, SpaceBook is proud to be India's fastest-growing workspace booking 
              platform, trusted by freelancers, startups, and enterprises alike. We're 
              not just about booking spaces – we're about building the future of work 
              in India.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-purple-700 rounded-lg text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Workspace?</h2>
          <p className="text-purple-100 mb-6">
            Join thousands of professionals who trust SpaceBook for their workspace needs
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

export default About;
