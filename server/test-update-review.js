const mongoose = require('mongoose');
require('dotenv').config();

const { createRating } = require('./controllers/RatingandReviewNew');

const mockReq = {
  user: { id: '68a4d0e8f449a4c9ca5dfa7e' },
  body: {
    courseId: '68a4e4c2bcd3f1679db08c46', // Nature course
    rating: 4,
    review: 'Updated review: This Nature course is really good! I learned a lot about ecosystems and biodiversity. Would recommend to others interested in environmental science.'
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
    console.log('🧪 Testing review update functionality...');
    await createRating(mockReq, mockRes);
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
  }
})();
