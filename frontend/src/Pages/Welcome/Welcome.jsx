import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Shield,
} from "lucide-react";

const Welcome = () => {
  // Clear any existing user data to ensure clean welcome page
  React.useEffect(() => {
    console.log("🧹 Welcome page: Clearing any cached user data");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        {/* Gradient overlay for aesthetic appeal */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo and Brand */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                <span className="text-purple-300">Pick</span>MyDesk
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 font-medium drop-shadow-md">
                Desk booking, simplified
              </p>
            </div>

            {/* Welcome Message */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
                Welcome to India's Premier Workspace Platform
              </h2>
              <p className="text-lg text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Connect with perfect workspaces across major Indian cities.
                Whether you're looking to book a workspace or manage your own,
                we've got you covered.
              </p>
            </div>

            {/* Login Options */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {/* User Login Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl hover:bg-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    I'm a User
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Looking to book workspaces? Find and reserve the perfect
                    space for your needs across India.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Browse verified workspaces
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Real-time booking & cancellation
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Location-based search
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Link
                      to="/user/login"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group"
                    >
                      Login as User
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/user/signup"
                      className="w-full border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                    >
                      Sign Up as User
                    </Link>
                  </div>
                </div>
              </div>

              {/* Admin Login Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl hover:bg-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    I'm an Admin
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Workspace owner or manager? Create and manage your workspace
                    listings with our powerful admin tools.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Create workspace listings
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Manage bookings & availability
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Analytics & insights
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Link
                      to="/admin/login"
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center group"
                    >
                      Login as Admin
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/admin/signup"
                      className="w-full border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center"
                    >
                      Sign Up as Admin
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-white mb-2 drop-shadow-md">
                  500+ Workspaces
                </h4>
                <p className="text-sm text-gray-200 drop-shadow-sm">
                  Verified spaces across India
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-white mb-2 drop-shadow-md">
                  50+ Cities
                </h4>
                <p className="text-sm text-gray-200 drop-shadow-sm">
                  Major Indian cities covered
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-white mb-2 drop-shadow-md">
                  24/7 Booking
                </h4>
                <p className="text-sm text-gray-200 drop-shadow-sm">
                  Book anytime, anywhere
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-white mb-2 drop-shadow-md">
                  Instant Booking
                </h4>
                <p className="text-sm text-gray-200 drop-shadow-sm">
                  Immediate confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
