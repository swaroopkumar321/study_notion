const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const mongoose = require('mongoose')
const User = require('./models/User')
const Course = require('./models/Course')
const CourseProgress = require('./models/CourseProgress')

async function run() {
  await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  
  const userId = '68a4d0e8f449a4c9ca5dfa7e'
  const testingId = '68a4cce3ea7af1e14e192fb4'
  const natureId = '68a4e4c2bcd3f1679db08c46'
  const testId = '68a554fe1194e9bf6ff9eb11'
  
  console.log('Removing user from Nature and test courses, keeping only Testing...')
  
  // Remove from Nature course
  await Course.findByIdAndUpdate(natureId, { $pull: { studentsEnroled: userId } })
  console.log('✅ Removed from Nature course')
  
  // Remove from test course
  await Course.findByIdAndUpdate(testId, { $pull: { studentsEnroled: userId } })
  console.log('✅ Removed from test course')
  
  // Remove courses from user (keep only Testing)
  await User.findByIdAndUpdate(userId, { $set: { courses: [testingId] } })
  console.log('✅ Updated user courses to only include Testing')
  
  // Remove course progress for Nature and test
  await CourseProgress.deleteMany({ userId, courseID: { $in: [natureId, testId] } })
  console.log('✅ Removed course progress for Nature and test')
  
  // Verify final state
  const user = await User.findById(userId).select('courses').lean()
  const testing = await Course.findById(testingId).select('studentsEnroled').lean()
  const nature = await Course.findById(natureId).select('studentsEnroled').lean()
  const test = await Course.findById(testId).select('studentsEnroled').lean()
  
  console.log('\n📋 Final enrollment state:')
  console.log('User courses:', user.courses.map(String))
  console.log('Testing studentsEnroled:', testing.studentsEnroled.map(String))
  console.log('Nature studentsEnroled:', nature.studentsEnroled.map(String))
  console.log('Test studentsEnroled:', test.studentsEnroled.map(String))
  
  await mongoose.connection.close()
  console.log('\n✅ Done')
}

run()
