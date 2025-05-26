import React, { useState } from 'react';
import axios from 'axios';

const TestBooking = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check if backend is running
      console.log("🔄 Testing backend connection...");
      try {
        const backendResponse = await axios.get(`${baseURL}`);
        results.backend = { status: 'success', message: 'Backend is running', data: backendResponse.data };
      } catch (error) {
        results.backend = { status: 'error', message: 'Backend not accessible', error: error.message };
      }

      // Test 2: Check authentication
      console.log("🔄 Testing authentication...");
      const token = localStorage.getItem('token');
      if (!token) {
        results.auth = { status: 'error', message: 'No token found - user not logged in' };
      } else {
        results.auth = { status: 'success', message: 'Token found', token: token.substring(0, 20) + '...' };
        
        // Test 3: Test token validity
        try {
          const authResponse = await axios.get(`${baseURL}/bookings/user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          results.tokenValid = { status: 'success', message: 'Token is valid', data: authResponse.data };
        } catch (error) {
          results.tokenValid = { status: 'error', message: 'Token is invalid', error: error.response?.data?.message || error.message };
        }
      }

      // Test 4: Check workspaces
      console.log("🔄 Testing workspaces...");
      try {
        const workspacesResponse = await axios.get(`${baseURL}/workspaces`);
        results.workspaces = { 
          status: 'success', 
          message: `Found ${workspacesResponse.data.length} workspaces`,
          firstWorkspace: workspacesResponse.data[0]?._id 
        };
      } catch (error) {
        results.workspaces = { status: 'error', message: 'Failed to fetch workspaces', error: error.message };
      }

      // Test 5: Test booking creation (if we have a valid token and workspace)
      if (results.tokenValid?.status === 'success' && results.workspaces?.firstWorkspace) {
        console.log("🔄 Testing booking creation...");
        try {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];

          const bookingData = {
            workspaceId: results.workspaces.firstWorkspace,
            startDate: tomorrowStr,
            endDate: tomorrowStr,
            startTime: "09:00",
            endTime: "17:00",
            guestCount: 1,
            contactInfo: {
              phone: "+919876543210",
              email: "test@example.com"
            }
          };

          const bookingResponse = await axios.post(`${baseURL}/bookings`, bookingData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          results.booking = { status: 'success', message: 'Booking created successfully!', data: bookingResponse.data };
        } catch (error) {
          results.booking = { 
            status: 'error', 
            message: 'Booking failed', 
            error: error.response?.data?.message || error.message,
            details: error.response?.data
          };
        }
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
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Booking System Diagnostics</h1>
        
        <div className="mb-6">
          <button
            onClick={runTests}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
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
                {result.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">Show Details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
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

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">Quick Fixes:</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• <strong>Not logged in?</strong> Go to <a href="/login" className="underline">Login</a> or <a href="/signup" className="underline">Signup</a></li>
            <li>• <strong>Backend not running?</strong> Check if the backend server is started</li>
            <li>• <strong>Token invalid?</strong> Try logging out and logging back in</li>
            <li>• <strong>No workspaces?</strong> Run the seed data script</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestBooking;
