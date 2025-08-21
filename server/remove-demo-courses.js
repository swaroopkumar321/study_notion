require('dotenv').config()
const mongoose = require("mongoose")
const Course = require("./models/Course")
const Category = require("./models/Category")
const User = require("./models/User")
const Section = require("./models/Section")
const SubSection = require("./models/Subsection")

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Demo courses that were created
const demoCourseNames = [
  "Complete HTML & CSS Masterclass",
  "JavaScript Complete Course", 
  "React.js Complete Guide",
  "Python for Data Science",
  "Machine Learning Fundamentals",
  "React Native Mobile Apps",
  "Flutter App Development",
  "AWS Cloud Fundamentals"
]

async function removeDemoCourses() {
  try {
    console.log("🗑️  Starting removal of demo courses...")
    
    for (const courseName of demoCourseNames) {
      console.log(`\n🔍 Looking for course: "${courseName}"`)
      
      // Find the course
      const course = await Course.findOne({ courseName: courseName })
      if (!course) {
        console.log(`   ⏭️  Course "${courseName}" not found. Skipping...`)
        continue
      }
      
      console.log(`   📚 Found course: ${course.courseName} (ID: ${course._id})`)
      
      // Remove course from instructor's courses array
      if (course.instructor) {
        await User.findByIdAndUpdate(
          course.instructor,
          { $pull: { courses: course._id } },
          { new: true }
        )
        console.log(`   👨‍🏫 Removed course from instructor's courses`)
      }
      
      // Remove course from category's courses array
      if (course.category) {
        await Category.findByIdAndUpdate(
          course.category,
          { $pull: { courses: course._id } },
          { new: true }
        )
        console.log(`   📁 Removed course from category`)
      }
      
      // Delete all subsections first
      if (course.courseContent && course.courseContent.length > 0) {
        for (const sectionId of course.courseContent) {
          const section = await Section.findById(sectionId)
          if (section && section.subSection) {
            // Delete all subsections in this section
            for (const subSectionId of section.subSection) {
              await SubSection.findByIdAndDelete(subSectionId)
            }
            console.log(`   🗂️  Deleted ${section.subSection.length} subsections from section: ${section.sectionName}`)
          }
          // Delete the section itself
          await Section.findByIdAndDelete(sectionId)
        }
        console.log(`   📋 Deleted ${course.courseContent.length} sections`)
      }
      
      // Finally delete the course itself
      await Course.findByIdAndDelete(course._id)
      console.log(`   ✅ Successfully deleted course: "${courseName}"`)
    }
    
    console.log("\n🎉 Demo courses removal completed!")
    
    // Show final summary
    console.log("\n📊 Final course count per category:")
    const categories = await Category.find().populate('courses')
    for (const category of categories) {
      console.log(`   ${category.name}: ${category.courses.length} courses`)
    }
    
  } catch (error) {
    console.error("❌ Error removing demo courses:", error)
  } finally {
    mongoose.connection.close()
    console.log("\n🔌 Database connection closed")
  }
}

// Run the script
removeDemoCourses()
