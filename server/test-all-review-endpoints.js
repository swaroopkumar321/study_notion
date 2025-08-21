const mongoose = require('mongoose');
require('dotenv').config();

// Test all review endpoints comprehensively
async function testAllReviewEndpoints() {
  console.log('🧪 COMPREHENSIVE REVIEW SYSTEM TESTING');
  console.log('=' * 50);

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Test data
    const testUserId = '68a4d0e8f449a4c9ca5dfa7e';
    const testCourseId = '68a4e4c2bcd3f1679db08c46';

    // Test 1: Check if backend routes are properly configured
    console.log('\n📋 TEST 1: Backend Route Configuration');
    console.log('-'.repeat(40));
    
    const express = require('express');
    const courseRoutes = require('./routes/Course');
    const app = express();
    
    // Get all routes from the router
    const routes = [];
    courseRoutes.stack.forEach(function(middleware) {
      if(middleware.route) {
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods)
        });
      }
    });
    
    console.log('Available routes:');
    routes.forEach(route => {
      if (route.path.includes('review') || route.path.includes('rating') || route.path.includes('Review')) {
        console.log(`  ${route.methods.join(', ').toUpperCase()} /api/v1/course${route.path}`);
      }
    });

    // Test 2: Test getAllRatingReview function directly
    console.log('\n📋 TEST 2: getAllRatingReview Function');
    console.log('-'.repeat(40));
    
    const { getAllRatingReview } = require('./controllers/RatingandReviewNew');
    
    const mockReq = {};
    const mockRes = {
      statusCode: null,
      responseData: null,
      status: function(code) { 
        this.statusCode = code; 
        return this; 
      },
      json: function(data) { 
        this.responseData = data;
        console.log(`Response Status: ${this.statusCode}`);
        console.log(`Response Data:`, JSON.stringify(data, null, 2));
        return this;
      }
    };

    await getAllRatingReview(mockReq, mockRes);
    
    // Test 3: Test HTTP endpoint directly
    console.log('\n📋 TEST 3: HTTP Endpoint Test');
    console.log('-'.repeat(40));
    
    const axios = require('axios');
    
    try {
      const response = await axios.get('http://localhost:4000/api/v1/course/getReviews');
      console.log(`✅ GET /api/v1/course/getReviews - Status: ${response.status}`);
      console.log(`Response:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(`❌ GET /api/v1/course/getReviews - Error: ${error.response?.status} ${error.response?.statusText}`);
      console.log(`Error details:`, error.response?.data);
    }

    // Test 4: Test other review endpoints
    console.log('\n📋 TEST 4: Other Review Endpoints');
    console.log('-'.repeat(40));
    
    const endpoints = [
      { method: 'POST', url: '/api/v1/course/getCourseReviews', data: { courseId: testCourseId } },
      { method: 'GET', url: '/api/v1/course/getAverageRating' }
    ];

    for (const endpoint of endpoints) {
      try {
        let response;
        if (endpoint.method === 'GET') {
          response = await axios.get(`http://localhost:4000${endpoint.url}`);
        } else {
          response = await axios.post(`http://localhost:4000${endpoint.url}`, endpoint.data);
        }
        console.log(`✅ ${endpoint.method} ${endpoint.url} - Status: ${response.status}`);
        console.log(`Response:`, JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.log(`❌ ${endpoint.method} ${endpoint.url} - Error: ${error.response?.status} ${error.response?.statusText}`);
        console.log(`Error details:`, error.response?.data);
      }
    }

    // Test 5: Frontend API call simulation
    console.log('\n📋 TEST 5: Frontend API Call Simulation');
    console.log('-'.repeat(40));
    
    try {
      // Simulate what the frontend ReviewSlider does
      const { data } = await axios.get('http://localhost:4000/api/v1/course/getReviews');
      
      if (data?.success && data?.data) {
        console.log(`✅ Frontend simulation successful`);
        console.log(`Found ${data.data.length} reviews`);
        
        // Check if reviews have required fields
        data.data.forEach((review, index) => {
          console.log(`Review ${index + 1}:`);
          console.log(`  - User: ${review.user?.firstName} ${review.user?.lastName}`);
          console.log(`  - Course: ${review.course?.courseName}`);
          console.log(`  - Rating: ${review.rating}`);
          console.log(`  - Review: ${review.review || 'No review text'}`);
        });
      } else {
        console.log(`❌ Frontend simulation failed - Invalid response structure`);
      }
    } catch (error) {
      console.log(`❌ Frontend simulation failed - ${error.message}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Testing completed');

  } catch (error) {
    console.error('❌ Test error:', error.message);
    await mongoose.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  testAllReviewEndpoints();
}

module.exports = { testAllReviewEndpoints };
