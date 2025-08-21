const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const mongoose = require('mongoose')
const { capturePayment, verifyPayment } = require('./controllers/payments')
const User = require('./models/User')

async function testEnrollment() {
  await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  
  const userId = '68a4d0e8f449a4c9ca5dfa7e'
  const natureId = '68a4e4c2bcd3f1679db08c46'
  
  console.log('Testing enrollment flow for Nature course...')
  
  // Mock request and response objects
  const captureReq = {
    body: { courses: [natureId] },
    user: { id: userId }
  }
  
  const captureRes = {
    status: function(code) { this.statusCode = code; return this },
    json: function(data) { console.log('CAPTURE RESPONSE:', this.statusCode, data); return data }
  }
  
  // Test capture payment (should create payment intent)
  console.log('\n1. Testing capturePayment...')
  await capturePayment(captureReq, captureRes)
  
  // Test verify payment (should enroll the student)
  const verifyReq = {
    body: { 
      payment_intent_id: 'pi_mock_test_123', 
      courses: [natureId] 
    },
    user: { id: userId }
  }
  
  const verifyRes = {
    status: function(code) { this.statusCode = code; return this },
    json: function(data) { console.log('VERIFY RESPONSE:', this.statusCode, data); return data }
  }
  
  console.log('\n2. Testing verifyPayment (enrollment)...')
  await verifyPayment(verifyReq, verifyRes)
  
  // Check final enrollment state
  const user = await User.findById(userId).select('courses').lean()
  console.log('\n3. Final user courses:', user.courses.map(String))
  
  await mongoose.connection.close()
  console.log('\n✅ Test completed')
}

testEnrollment()
