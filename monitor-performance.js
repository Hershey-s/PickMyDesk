#!/usr/bin/env node

/**
 * WorkspaceHub Performance Monitor
 * Continuously monitors application performance and health
 */

import axios from 'axios';
import { performance } from 'perf_hooks';

const API_BASE = 'http://localhost:5000';
const FRONTEND_BASE = 'http://localhost:5173';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiResponseTimes: [],
      frontendLoadTimes: [],
      errorCount: 0,
      successCount: 0,
      startTime: Date.now()
    };
  }

  async measureApiResponse(endpoint) {
    const startTime = performance.now();
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`, { timeout: 10000 });
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      this.metrics.apiResponseTimes.push(responseTime);
      this.metrics.successCount++;
      
      return {
        success: true,
        responseTime,
        status: response.status,
        dataSize: JSON.stringify(response.data).length
      };
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      this.metrics.errorCount++;
      
      return {
        success: false,
        responseTime,
        error: error.message
      };
    }
  }

  async measureFrontendLoad() {
    const startTime = performance.now();
    try {
      const response = await axios.get(FRONTEND_BASE, { timeout: 10000 });
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);
      
      this.metrics.frontendLoadTimes.push(loadTime);
      
      return {
        success: true,
        loadTime,
        status: response.status,
        pageSize: response.data.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  calculateStats(array) {
    if (array.length === 0) return { avg: 0, min: 0, max: 0 };
    
    const avg = Math.round(array.reduce((a, b) => a + b, 0) / array.length);
    const min = Math.min(...array);
    const max = Math.max(...array);
    
    return { avg, min, max };
  }

  async runHealthCheck() {
    console.log('🔍 Running Health Check...');
    
    // Test multiple endpoints
    const endpoints = ['/', '/workspaces'];
    const results = {};
    
    for (const endpoint of endpoints) {
      const result = await this.measureApiResponse(endpoint);
      results[endpoint] = result;
      
      if (result.success) {
        console.log(`✅ ${endpoint}: ${result.responseTime}ms (${result.status})`);
      } else {
        console.log(`❌ ${endpoint}: ${result.error}`);
      }
    }
    
    // Test frontend
    const frontendResult = await this.measureFrontendLoad();
    if (frontendResult.success) {
      console.log(`✅ Frontend: ${frontendResult.loadTime}ms`);
    } else {
      console.log(`❌ Frontend: ${frontendResult.error}`);
    }
    
    return results;
  }

  async runLoadTest(duration = 30000) {
    console.log(`🚀 Running Load Test for ${duration/1000} seconds...`);
    
    const startTime = Date.now();
    let requestCount = 0;
    
    while (Date.now() - startTime < duration) {
      // Test API endpoints
      await this.measureApiResponse('/workspaces');
      requestCount++;
      
      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show progress every 10 requests
      if (requestCount % 10 === 0) {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        console.log(`   ${requestCount} requests completed (${elapsed}s elapsed)`);
      }
    }
    
    console.log(`✅ Load test completed: ${requestCount} requests`);
  }

  printDetailedReport() {
    console.log('\n📊 Detailed Performance Report');
    console.log('================================');
    
    // API Performance
    const apiStats = this.calculateStats(this.metrics.apiResponseTimes);
    console.log('\n🔌 API Performance:');
    console.log(`   Average Response Time: ${apiStats.avg}ms`);
    console.log(`   Fastest Response: ${apiStats.min}ms`);
    console.log(`   Slowest Response: ${apiStats.max}ms`);
    console.log(`   Total Requests: ${this.metrics.apiResponseTimes.length}`);
    
    // Frontend Performance
    const frontendStats = this.calculateStats(this.metrics.frontendLoadTimes);
    console.log('\n🌐 Frontend Performance:');
    console.log(`   Average Load Time: ${frontendStats.avg}ms`);
    console.log(`   Fastest Load: ${frontendStats.min}ms`);
    console.log(`   Slowest Load: ${frontendStats.max}ms`);
    
    // Reliability
    const totalRequests = this.metrics.successCount + this.metrics.errorCount;
    const successRate = totalRequests > 0 ? Math.round((this.metrics.successCount / totalRequests) * 100) : 0;
    
    console.log('\n🛡️ Reliability:');
    console.log(`   Success Rate: ${successRate}%`);
    console.log(`   Successful Requests: ${this.metrics.successCount}`);
    console.log(`   Failed Requests: ${this.metrics.errorCount}`);
    
    // Performance Assessment
    console.log('\n🎯 Performance Assessment:');
    
    if (apiStats.avg < 200) {
      console.log('   ✅ API Response Time: Excellent (< 200ms)');
    } else if (apiStats.avg < 500) {
      console.log('   ⚠️  API Response Time: Good (< 500ms)');
    } else {
      console.log('   🚨 API Response Time: Needs Improvement (> 500ms)');
    }
    
    if (frontendStats.avg < 1000) {
      console.log('   ✅ Frontend Load Time: Excellent (< 1s)');
    } else if (frontendStats.avg < 3000) {
      console.log('   ⚠️  Frontend Load Time: Good (< 3s)');
    } else {
      console.log('   🚨 Frontend Load Time: Needs Improvement (> 3s)');
    }
    
    if (successRate >= 99) {
      console.log('   ✅ Reliability: Excellent (≥ 99%)');
    } else if (successRate >= 95) {
      console.log('   ⚠️  Reliability: Good (≥ 95%)');
    } else {
      console.log('   🚨 Reliability: Needs Improvement (< 95%)');
    }
  }

  async startMonitoring() {
    console.log('🔄 Starting Continuous Performance Monitoring...');
    console.log('Press Ctrl+C to stop\n');
    
    // Run initial health check
    await this.runHealthCheck();
    
    // Start continuous monitoring
    const interval = setInterval(async () => {
      await this.measureApiResponse('/workspaces');
      await this.measureFrontendLoad();
      
      // Print live stats every 30 seconds
      if (this.metrics.apiResponseTimes.length % 30 === 0) {
        const apiStats = this.calculateStats(this.metrics.apiResponseTimes.slice(-30));
        console.log(`📈 Last 30 requests - Avg: ${apiStats.avg}ms, Success Rate: ${Math.round((this.metrics.successCount / (this.metrics.successCount + this.metrics.errorCount)) * 100)}%`);
      }
    }, 1000);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      clearInterval(interval);
      this.printDetailedReport();
      process.exit(0);
    });
  }
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

const monitor = new PerformanceMonitor();

switch (command) {
  case 'health':
    monitor.runHealthCheck();
    break;
  case 'load':
    const duration = parseInt(args[1]) || 30000;
    monitor.runLoadTest(duration).then(() => monitor.printDetailedReport());
    break;
  case 'monitor':
    monitor.startMonitoring();
    break;
  default:
    console.log('WorkspaceHub Performance Monitor');
    console.log('Usage:');
    console.log('  node monitor-performance.js health     - Run health check');
    console.log('  node monitor-performance.js load [ms]  - Run load test');
    console.log('  node monitor-performance.js monitor    - Start monitoring');
}
