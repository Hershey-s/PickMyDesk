#!/usr/bin/env node

/**
 * WorkspaceHub Application Tester
 * Tests API endpoints, database connectivity, and basic functionality
 */

import axios from 'axios';
import { performance } from 'perf_hooks';

const API_BASE = 'http://localhost:5000';
const FRONTEND_BASE = 'http://localhost:5173';

class WorkspaceHubTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runTest(name, testFunction) {
    const startTime = performance.now();
    try {
      await testFunction();
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      this.results.passed++;
      this.results.tests.push({
        name,
        status: '✅ PASS',
        duration: `${duration}ms`,
        error: null
      });
      console.log(`✅ ${name} - ${duration}ms`);
    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      this.results.failed++;
      this.results.tests.push({
        name,
        status: '❌ FAIL',
        duration: `${duration}ms`,
        error: error.message
      });
      console.log(`❌ ${name} - ${error.message}`);
    }
  }

  async testServerHealth() {
    const response = await axios.get(`${API_BASE}`, { timeout: 5000 });
    if (response.status !== 200) {
      throw new Error(`Server returned status ${response.status}`);
    }
    if (!response.data.includes('Hello from the backend')) {
      throw new Error('Unexpected server response');
    }
  }

  async testFrontendHealth() {
    const response = await axios.get(`${FRONTEND_BASE}`, { timeout: 5000 });
    if (response.status !== 200) {
      throw new Error(`Frontend returned status ${response.status}`);
    }
    if (!response.data.includes('WorksSpaceHub')) {
      throw new Error('Frontend not loading properly');
    }
  }

  async testGetWorkspaces() {
    const response = await axios.get(`${API_BASE}/workspaces`, { timeout: 5000 });
    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }
    if (!Array.isArray(response.data)) {
      throw new Error('Workspaces endpoint should return an array');
    }
    if (response.data.length === 0) {
      throw new Error('No workspaces found - database might be empty');
    }
    console.log(`   Found ${response.data.length} workspaces`);
  }

  async testUserSignup() {
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123'
    };

    const response = await axios.post(`${API_BASE}/signup`, testUser, { timeout: 5000 });
    if (response.status !== 201) {
      throw new Error(`Signup returned status ${response.status}`);
    }
    if (!response.data.token) {
      throw new Error('Signup should return a JWT token');
    }
    console.log(`   Created user: ${testUser.email}`);
  }

  async testUserLogin() {
    // Use existing test user
    const loginData = {
      email: 'john@example.com',
      password: 'password123'
    };

    const response = await axios.post(`${API_BASE}/login`, loginData, { timeout: 5000 });
    if (response.status !== 200) {
      throw new Error(`Login returned status ${response.status}`);
    }
    if (!response.data.token) {
      throw new Error('Login should return a JWT token');
    }
    console.log(`   Logged in user: ${loginData.email}`);
  }

  async testCreateWorkspace() {
    // First login to get token
    const loginResponse = await axios.post(`${API_BASE}/login`, {
      email: 'john@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    const workspaceData = {
      title: `Test Workspace ${Date.now()}`,
      listingImage: 'https://example.com/image.jpg',
      location: 'Test City',
      country: 'Test Country',
      description: 'A test workspace for automated testing',
      priceUnit: 'hour',
      tags: ['Test', 'Automated'],
      price: 25
    };

    const response = await axios.post(`${API_BASE}/workspaces`, workspaceData, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });

    if (response.status !== 201) {
      throw new Error(`Create workspace returned status ${response.status}`);
    }
    console.log(`   Created workspace: ${workspaceData.title}`);
  }

  async testPerformance() {
    const startTime = performance.now();
    
    // Test multiple concurrent requests
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(axios.get(`${API_BASE}/workspaces`));
    }
    
    await Promise.all(promises);
    const endTime = performance.now();
    const totalTime = Math.round(endTime - startTime);
    
    if (totalTime > 3000) {
      throw new Error(`Performance test took ${totalTime}ms (should be < 3000ms)`);
    }
    console.log(`   5 concurrent requests completed in ${totalTime}ms`);
  }

  async runAllTests() {
    console.log('🧪 Starting WorkspaceHub Application Tests...\n');

    // Basic connectivity tests
    await this.runTest('Server Health Check', () => this.testServerHealth());
    await this.runTest('Frontend Health Check', () => this.testFrontendHealth());

    // API functionality tests
    await this.runTest('Get Workspaces API', () => this.testGetWorkspaces());
    await this.runTest('User Signup API', () => this.testUserSignup());
    await this.runTest('User Login API', () => this.testUserLogin());
    await this.runTest('Create Workspace API', () => this.testCreateWorkspace());

    // Performance tests
    await this.runTest('Performance Test', () => this.testPerformance());

    // Print summary
    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`);

    if (this.results.failed > 0) {
      console.log('\n🚨 Failed Tests:');
      this.results.tests
        .filter(test => test.status.includes('FAIL'))
        .forEach(test => {
          console.log(`   ❌ ${test.name}: ${test.error}`);
        });
    }

    console.log('\n🎯 Recommendations:');
    if (this.results.failed === 0) {
      console.log('   🎉 All tests passed! Your application is working efficiently.');
    } else if (this.results.failed <= 2) {
      console.log('   ⚠️  Minor issues detected. Check failed tests above.');
    } else {
      console.log('   🚨 Multiple issues detected. Review your application setup.');
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new WorkspaceHubTester();
  tester.runAllTests().catch(console.error);
}

export default WorkspaceHubTester;
