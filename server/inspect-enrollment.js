const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const mongoose = require('mongoose')
const User = require('./models/User')
const Course = require('./models/Course')

async function run() {
  const userId = '68a4d0e8f449a4c9ca5dfa7e'
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected')

    const user = await User.findById(userId).populate('courses', 'courseName status studentsEnroled').lean()
    if (!user) {
      console.log('User not found')
      return
    }
    console.log(`User: ${user.firstName} ${user.lastName} (${user.email})`)
    console.log(`Enrolled courses (${user.courses.length}):`)
    for (const c of user.courses) {
      const hasUser = (c.studentsEnroled || []).some((id) => id && id.toString() === userId)
      console.log(`- ${c.courseName} [${c._id}] status=${c.status} hasUserInCourse=${hasUser}`)
    }

    const nature = await Course.findOne({ courseName: { $regex: /nature/i } }).select('courseName status studentsEnroled').lean()
    if (!nature) {
      console.log('No course found matching name "Nature"')
    } else {
      const hasUser = (nature.studentsEnroled || []).some((id) => id && id.toString() === userId)
      console.log(`\nNature match: ${nature.courseName} [${nature._id}] status=${nature.status} studentsEnroled=${nature.studentsEnroled.length} hasUserInCourse=${hasUser}`)
    }
  } catch (e) {
    console.error('Error:', e)
  } finally {
    await mongoose.connection.close()
    console.log('Closed')
  }
}

run()
