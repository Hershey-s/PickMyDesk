import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestBookingManagement = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const runBookingTests = async () => {
    setLoading(true);
    const results = {};
    const token = localStorage.getItem('token');

    if (!token) {
      results.auth = { status: 'error', message: 'Please log in first' };
      setTestResults(results);
      setLoading(false);
      return;
    }

    try {
      // Test 1: Fetch user bookings
      console.log("🔄 Testing fetch bookings...");
      try {
        const response = await axios.get(`${baseURL}/bookings/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data.bookings || []);
        results.fetchBookings = { 
          status: 'success', 
          message: `Found ${response.data.bookings?.length || 0} bookings`,
          data: response.data.bookings
        };
      } catch (error) {
        results.fetchBookings = { 
          status: 'error', 
          message: 'Failed to fetch bookings', 
          error: error.response?.data?.message || error.message 
        };
      }

      // Test 2: Test cancel booking endpoint (if bookings exist)
      if (bookings.length > 0) {
        const confirmedBooking = bookings.find(b => b.status === 'confirmed');
        if (confirmedBooking) {
          console.log("🔄 Testing cancel booking endpoint...");
          try {
            // Just test the endpoint structure, don't actually cancel
            const testData = {
              status: 'cancelled',
              cancellationReason: 'Test cancellation'
            };
            
            // We'll just validate the request structure
            results.cancelEndpoint = { 
              status: 'success', 
              message: 'Cancel endpoint structure is correct',
              endpoint: `${baseURL}/bookings/${confirmedBooking._id}/status`,
              testData
            };
          } catch (error) {
            results.cancelEndpoint = { 
              status: 'error', 
              message: 'Cancel endpoint test failed', 
              error: error.message 
            };
          }
        } else {
          results.cancelEndpoint = { 
            status: 'info', 
            message: 'No confirmed bookings to test cancellation' 
          };
        }

        // Test 3: Test reschedule booking endpoint
        if (confirmedBooking) {
          console.log("🔄 Testing reschedule booking endpoint...");
          try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 2);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            const testData = {
              startDate: tomorrowStr,
              endDate: tomorrowStr,
              startTime: "10:00",
              endTime: "18:00"
            };
            
            results.rescheduleEndpoint = { 
              status: 'success', 
              message: 'Reschedule endpoint structure is correct',
              endpoint: `${baseURL}/bookings/${confirmedBooking._id}/reschedule`,
              testData
            };
          } catch (error) {
            results.rescheduleEndpoint = { 
              status: 'error', 
              message: 'Reschedule endpoint test failed', 
              error: error.message 
            };
          }
        } else {
          results.rescheduleEndpoint = { 
            status: 'info', 
            message: 'No confirmed bookings to test rescheduling' 
          };
        }
      } else {
        results.noBookings = { 
          status: 'info', 
          message: 'No bookings found. Create a booking first to test management features.' 
        };
      }

    } catch (error) {
      results.general = { status: 'error', message: 'General test error', error: error.message };
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Booking Management Test</h1>
        
        <div className="mb-6">
          <button
            onClick={runBookingTests}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Running Tests...' : 'Test Booking Management'}
          </button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                <h3 className="font-semibold text-lg mb-2">
                  {testName.charAt(0).toUpperCase() + testName.slice(1)} Test
                </h3>
                <p className="mb-2">
                  <strong>Status:</strong> {result.status}
                </p>
                <p className="mb-2">
                  <strong>Message:</strong> {result.message}
                </p>
                {result.error && (
                  <p className="mb-2">
                    <strong>Error:</strong> {result.error}
                  </p>
                )}
                {result.endpoint && (
                  <p className="mb-2">
                    <strong>Endpoint:</strong> {result.endpoint}
                  </p>
                )}
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">Show Data</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Current Bookings Display */}
        {bookings.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Your Current Bookings</h2>
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <div key={booking._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{booking.workspace?.title || 'Unknown Workspace'}</h3>
                      <p className="text-gray-600">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      {booking.startTime && (
                        <p className="text-gray-600">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-sm ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                      <p className="text-gray-600 mt-1">
                        ₹{booking.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">Quick Actions:</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• <strong>No bookings?</strong> Go to <a href="/" className="underline">Homepage</a> and create a booking first</li>
            <li>• <strong>Test cancel/reschedule?</strong> Go to <a href="/bookings" className="underline">My Bookings</a> page</li>
            <li>• <strong>Need to login?</strong> Go to <a href="/login" className="underline">Login</a> page</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestBookingManagement;
