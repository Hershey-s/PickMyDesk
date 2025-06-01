import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleOAuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Collect debug information
    const info = {
      currentUrl: window.location.href,
      origin: window.location.origin,
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      apiUrl: import.meta.env.VITE_API_URL,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    setDebugInfo(info);
  }, []);

  const addTestResult = (test, status, message, data = null) => {
    const result = {
      test,
      status, // 'success', 'error', 'info'
      message,
      data,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTestResults(prev => [...prev, result]);
  };

  const testBackendConnection = async () => {
    try {
      addTestResult("Backend Connection", "info", "Testing backend connection...");
      const response = await axios.get(debugInfo.apiUrl || "http://localhost:5007");
      addTestResult("Backend Connection", "success", "Backend is running", response.data);
    } catch (error) {
      addTestResult("Backend Connection", "error", `Backend connection failed: ${error.message}`);
    }
  };

  const testGoogleAuthEndpoint = async () => {
    try {
      addTestResult("Google Auth Endpoint", "info", "Testing Google auth endpoint...");
      const response = await axios.post(`${debugInfo.apiUrl || "http://localhost:5007"}/auth/google`, {
        token: "test_token",
        expectedRole: "user"
      });
      addTestResult("Google Auth Endpoint", "error", "Should have failed with invalid token");
    } catch (error) {
      if (error.response?.status === 400) {
        addTestResult("Google Auth Endpoint", "success", "Endpoint exists and validates tokens properly");
      } else {
        addTestResult("Google Auth Endpoint", "error", `Unexpected error: ${error.message}`);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      addTestResult("Google Login", "info", "Google login successful, testing backend...");
      
      const response = await axios.post(`${debugInfo.apiUrl || "http://localhost:5007"}/auth/google`, {
        token: credentialResponse.credential,
        expectedRole: "user",
      });

      addTestResult("Google Login", "success", "Complete Google OAuth flow successful!", {
        user: response.data.user,
        hasToken: !!response.data.token
      });

      // Store the token for testing
      localStorage.setItem("debug_token", response.data.token);
      localStorage.setItem("debug_user", JSON.stringify(response.data.user));

    } catch (error) {
      addTestResult("Google Login", "error", `Google OAuth failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    addTestResult("Google Login", "error", `Google login failed: ${JSON.stringify(error)}`);
  };

  const runAllTests = async () => {
    setTestResults([]);
    addTestResult("Test Suite", "info", "Starting comprehensive OAuth tests...");
    
    await testBackendConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testGoogleAuthEndpoint();
    
    addTestResult("Test Suite", "info", "Automated tests complete. Try Google login button above.");
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '⚪';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔐 Google OAuth Debug Tool</h1>
      
      {/* Debug Information */}
      <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Debug Information</h3>
        <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>
          <div><strong>Current URL:</strong> {debugInfo.currentUrl}</div>
          <div><strong>Origin:</strong> {debugInfo.origin}</div>
          <div><strong>Google Client ID:</strong> {debugInfo.clientId}</div>
          <div><strong>API URL:</strong> {debugInfo.apiUrl}</div>
          <div><strong>Timestamp:</strong> {debugInfo.timestamp}</div>
        </div>
      </div>

      {/* Test Controls */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests}
          style={{ 
            background: '#3b82f6', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '5px', 
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Run All Tests
        </button>
        <button 
          onClick={clearResults}
          style={{ 
            background: '#6b7280', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      {/* Google Login Button */}
      <div style={{ background: '#fff', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Test Google Login</h3>
        <div style={{ marginBottom: '15px' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            shape="rectangular"
            size="large"
            useOneTap={false}
            auto_select={false}
          />
        </div>
        {loading && <div style={{ color: '#3b82f6' }}>Processing Google login...</div>}
      </div>

      {/* Test Results */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ padding: '15px', margin: 0, borderBottom: '1px solid #e5e7eb' }}>Test Results</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {testResults.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
              No test results yet. Click "Run All Tests" to start.
            </div>
          ) : (
            testResults.map((result, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '10px 15px', 
                  borderBottom: index < testResults.length - 1 ? '1px solid #f3f4f6' : 'none',
                  borderLeft: `4px solid ${getStatusColor(result.status)}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ marginRight: '8px' }}>{getStatusIcon(result.status)}</span>
                  <strong>{result.test}</strong>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6b7280' }}>
                    {result.timestamp}
                  </span>
                </div>
                <div style={{ color: '#374151', marginBottom: '5px' }}>{result.message}</div>
                {result.data && (
                  <details style={{ fontSize: '12px', color: '#6b7280' }}>
                    <summary style={{ cursor: 'pointer' }}>View Details</summary>
                    <pre style={{ background: '#f9fafb', padding: '8px', borderRadius: '4px', overflow: 'auto' }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>🔧 Troubleshooting Steps:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Ensure backend is running on port 5007</li>
          <li>Check that Google Client ID is correctly configured</li>
          <li>Verify that localhost:5173 is added to Google OAuth authorized origins</li>
          <li>Make sure google-auth-library is installed in backend</li>
          <li>Check browser console for additional error messages</li>
        </ol>
      </div>
    </div>
  );
};

export default GoogleOAuthDebug;
