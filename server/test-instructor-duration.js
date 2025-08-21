require('dotenv').config()
const mongoose = require("mongoose")
const Course = require("./models/Course")
const Section = require("./models/Section")
const SubSection = require("./models/Subsection")
const { convertSecondsToDuration } = require("./utils/secToDuration")

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function testInstructorCourses() {
  try {
    console.log("🔍 Testing instructor courses with duration...")
    
    // Find instructor user ID (we know it from previous tests)
    const instructorId = "68a3f4e83449a4c9ca5dfa82"
    
    // Find all courses belonging to the instructor with populated course content
    const instructorCourses = await Course.find({
      instructor: instructorId,
    })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .sort({ createdAt: -1 })

    console.log(`📚 Found ${instructorCourses.length} courses for instructor`)

    // Calculate total duration for each course
    const coursesWithDuration = instructorCourses.map((course) => {
      let totalDurationInSeconds = 0
      course.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0
          totalDurationInSeconds += timeDurationInSeconds
        })
      })

      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
      
      return {
        courseName: course.courseName,
        totalDuration,
        sections: course.courseContent.length,
        totalDurationInSeconds
      }
    })

    console.log("\n📋 Courses with Duration:")
    coursesWithDuration.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.courseName}`)
      console.log(`      Duration: ${course.totalDuration}`)
      console.log(`      Sections: ${course.sections}`)
      console.log(`      Total Seconds: ${course.totalDurationInSeconds}`)
    })
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    mongoose.connection.close()
    console.log("\n🔌 Database connection closed")
  }
}

// Run the test
testInstructorCourses()
