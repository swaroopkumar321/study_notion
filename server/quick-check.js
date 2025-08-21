const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const mongoose = require('mongoose')
const User = require('./models/User')
const Course = require('./models/Course')

async function run() {
  await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  const userId = '68a4d0e8f449a4c9ca5dfa7e'
  const courseId = '68a4e4c2bcd3f1679db08c46' // Nature

  const u = await User.findById(userId).select('courses').lean()
  const c = await Course.findById(courseId).select('studentsEnroled').lean()
  console.log('User.courses:', u && u.courses && u.courses.map(String))
  console.log('Course.studentsEnroled:', c && c.studentsEnroled && c.studentsEnroled.map(String))
  const inUser = (u.courses||[]).some((id)=> String(id)===courseId)
  const inCourse = (c.studentsEnroled||[]).some((id)=> String(id)===userId)
  console.log('inUser?', inUser, 'inCourse?', inCourse)
  await mongoose.connection.close()
}
run()
