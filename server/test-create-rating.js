const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const mongoose = require('mongoose')
const { createRating } = require('./controllers/RatingandReview')

async function run() {
  await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  const userId = '68a4d0e8f449a4c9ca5dfa7e'
  const courseId = '68a4e4c2bcd3f1679db08c46' // Nature
  const req = {
    user: { id: userId },
    body: { rating: 4, review: 'Test review via script', courseId }
  }
  const res = {
    status(code) { this.statusCode = code; return this },
    json(payload) { console.log('RES', this.statusCode, payload); return payload }
  }
  try {
    console.log('Invoking createRating for Nature...')
    await createRating(req, res)
  } catch (e) {
    console.error('Error invoking createRating:', e)
  } finally {
    await mongoose.connection.close()
  }
}

run()
