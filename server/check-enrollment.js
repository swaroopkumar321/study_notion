require('dotenv').config()
const mongoose = require("mongoose")
const User = require("./models/User")
const Course = require("./models/Course")
const CourseProgress = require("./models/CourseProgress")

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function checkUserEnrollment() {
  try {
    console.log("🔍 Checking user enrollment...")
    
    const userId = "68a4d0e8f449a4c9ca5dfa7e"
    
    // Find user with populated courses
    const user = await User.findById(userId)
      .populate('courses')
      .populate('courseProgress')
    
    if (!user) {
      console.log("❌ User not found")
      return
    }
    
    console.log(`👤 User: ${user.firstName} ${user.lastName} (${user.email})`)
    console.log(`📚 Total Enrolled Courses: ${user.courses.length}`)
    console.log(`📊 Course Progress Records: ${user.courseProgress.length}`)
    
    if (user.courses.length > 0) {
      console.log("\n📋 Enrolled Courses:")
      user.courses.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.courseName} - ₹${course.price}`)
        console.log(`      Description: ${course.courseDescription}`)
        console.log(`      Status: ${course.status}`)
      })
    } else {
      console.log("❌ No courses enrolled")
    }
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    mongoose.connection.close()
    console.log("\n🔌 Database connection closed")
  }
}

// Run the check
checkUserEnrollment()
