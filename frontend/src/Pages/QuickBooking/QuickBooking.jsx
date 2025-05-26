import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuickBooking = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get(`${baseURL}/workspaces`);
      setWorkspaces(response.data.slice(0, 3)); // Get first 3 workspaces
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const createQuickBooking = async (workspace) => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in first');
        setLoading(false);
        return;
      }

      // Create booking for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const bookingData = {
        workspaceId: workspace._id,
        startDate: tomorrowStr,
        endDate: tomorrowStr,
        startTime: workspace.priceUnit === 'hour' ? "09:00" : undefined,
        endTime: workspace.priceUnit === 'hour' ? "17:00" : undefined,
        guestCount: 1,
        contactInfo: {
          phone: "+919876543210",
          email: "test@example.com"
        },
        specialRequests: "Test booking for cancel/reschedule testing"
      };

      console.log("Creating booking with data:", bookingData);

      const response = await axios.post(`${baseURL}/bookings`, bookingData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Booking created:", response.data);
      setMessage(`✅ Booking created successfully! Booking ID: ${response.data.booking._id}`);
      
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setMessage(`❌ Failed to create booking: ${errorMessage}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🚀 Quick Booking Creator</h1>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            Create a test booking to test the cancel and reschedule functionality.
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div key={workspace._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={workspace.listingImage}
                alt={workspace.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{workspace.title}</h3>
                <p className="text-gray-600 mb-2">📍 {workspace.location}</p>
                <p className="text-purple-600 font-semibold mb-4">
                  ₹{workspace.price}/{workspace.priceUnit}
                </p>
                
                <button
                  onClick={() => createQuickBooking(workspace)}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Test Booking'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Make sure you're logged in</li>
            <li>Click "Create Test Booking" on any workspace above</li>
            <li>Go to <a href="/bookings" className="text-purple-600 underline">My Bookings</a> page</li>
            <li>Test the Cancel and Reschedule buttons</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>

        <div className="mt-6 flex gap-4">
          <a
            href="/bookings"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            View My Bookings
          </a>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuickBooking;
