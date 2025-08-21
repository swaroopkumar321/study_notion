const mongoose = require('mongoose');
require('dotenv').config();

const { getCourseReviews } = require('./controllers/RatingandReviewNew');

const mockReq = {
  body: {
    courseId: '68a4e4c2bcd3f1679db08c46' // Nature course
  }
};

const mockRes = {
  status: function(code) { this.statusCode = code; return this; },
  json: function(data) { 
    console.log('Response Status:', this.statusCode);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    return this;
  }
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('🧪 Testing getCourseReviews...');
    await getCourseReviews(mockReq, mockRes);
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
  }
})();
