require('dotenv').config()
const mongoose = require("mongoose")
const Course = require("./models/Course")
const Category = require("./models/Category")

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function checkCoursesInCategories() {
  try {
    console.log("🔍 Checking courses in each category...")
    
    const categories = await Category.find().populate('courses')
    
    console.log(`📚 Found ${categories.length} categories`)
    
    for (const category of categories) {
      console.log(`\n📁 ${category.name}:`)
      console.log(`   Description: ${category.description}`)
      console.log(`   Total Courses: ${category.courses.length}`)
      
      if (category.courses.length > 0) {
        category.courses.forEach((course, index) => {
          console.log(`   ${index + 1}. ${course.courseName} - ₹${course.price} (${course.status})`)
        })
      } else {
        console.log(`   ❌ No courses in this category`)
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    mongoose.connection.close()
    console.log("\n🔌 Database connection closed")
  }
}

// Run the check
checkCoursesInCategories()
