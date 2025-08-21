require('dotenv').config()
const mongoose = require("mongoose")
const Course = require("./models/Course")
const User = require("./models/User")
const CourseProgress = require("./models/CourseProgress")

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function manualEnrollment() {
  try {
    console.log("🚀 Starting manual enrollment...")
    
    const userId = "68a4d0e8f449a4c9ca5dfa7e"
    const courseId = "68a4cce3ea7af1e14e192fb4"
    
    console.log(`👤 User ID: ${userId}`)
    console.log(`📚 Course ID: ${courseId}`)
    
    // 1. Find the user
    const user = await User.findById(userId)
    if (!user) {
      console.log("❌ User not found")
      return
    }
    console.log(`✅ Found user: ${user.firstName} ${user.lastName} (${user.email})`)
    
    // 2. Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      console.log("❌ Course not found")
      return
    }
    console.log(`✅ Found course: ${course.courseName}`)
    
    // 3. Check if already enrolled
    if (course.studentsEnroled.includes(userId)) {
      console.log("⚠️ User is already enrolled in this course")
      return
    }
    
    // 4. Create course progress
    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    })
    console.log(`✅ Created course progress: ${courseProgress._id}`)
    
    // 5. Add student to course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnroled: userId } },
      { new: true }
    )
    console.log(`✅ Added student to course. Total enrolled: ${updatedCourse.studentsEnroled.length}`)
    
    // 6. Add course to user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: courseId,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    )
    console.log(`✅ Added course to user. Total courses: ${updatedUser.courses.length}`)
    
    console.log("🎉 Manual enrollment completed successfully!")
    console.log("📋 Summary:")
    console.log(`   User: ${user.firstName} ${user.lastName} (${user.email})`)
    console.log(`   Course: ${course.courseName}`)
    console.log(`   Course Progress ID: ${courseProgress._id}`)
    
  } catch (error) {
    console.error("❌ Error during manual enrollment:", error)
  } finally {
    mongoose.connection.close()
    console.log("🔌 Database connection closed")
  }
}

// Run the manual enrollment
manualEnrollment()
