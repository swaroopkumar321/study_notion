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

// Demo courses data
const demoCourses = [
  {
    categoryName: "Web Development",
    courses: [
      {
        courseName: "Complete HTML & CSS Masterclass",
        courseDescription: "Learn HTML5 and CSS3 from basics to advanced. Build responsive websites with modern CSS techniques including Flexbox, Grid, and animations.",
        price: 1999,
        whatYouWillLearn: "Master HTML5 semantics, CSS3 styling, responsive design, flexbox, CSS grid, animations, and modern web development practices.",
        tag: ["HTML", "CSS", "Web Development", "Frontend"],
        instructions: ["Basic computer knowledge", "Text editor installed", "Web browser", "Passion to learn"],
        thumbnail: "https://res.cloudinary.com/dqzlp8yfx/image/upload/v1692599180/Codehelp/html-css-course_zjk8om.jpg",
        status: "Published"
      },
      {
        courseName: "JavaScript Complete Course",
        courseDescription: "Master JavaScript from fundamentals to advanced concepts. Learn ES6+, DOM manipulation, async programming, and modern JavaScript frameworks.",
        price: 2499,
        whatYouWillLearn: "JavaScript fundamentals, ES6+ features, DOM manipulation, async programming, APIs, and modern development practices.",
        tag: ["JavaScript", "ES6", "DOM", "Frontend"],
        instructions: ["HTML & CSS knowledge", "Code editor", "Modern web browser", "GitHub account"],
        thumbnail: "https://res.cloudinary.com/dqzlp8yfx/image/upload/v1692599180/Codehelp/javascript-course_abc123.jpg",
        status: "Published"
      },
      {
        courseName: "React.js Complete Guide",
        courseDescription: "Learn React.js from scratch to advanced level. Build modern web applications with React hooks, context API, and state management.",
        price: 3499,
        whatYouWillLearn: "React components, JSX, hooks, state management, routing, API integration, and modern React development patterns.",
        tag: ["React", "JavaScript", "Frontend", "SPA"],
        instructions: ["JavaScript proficiency", "Node.js installed", "VS Code editor", "Git knowledge"],
        thumbnail: "https://res.cloudinary.com/dqzlp8yfx/image/upload/v1692599180/Codehelp/react-course_def456.jpg",
        status: "Published"
      }
    ]
  },
  {
    categoryName: "Data Science",
    courses: [
      {
        courseName: "Python for Data Science",
        courseDescription: "Learn Python programming specifically for data science. Master pandas, NumPy, matplotlib, and data analysis techniques.",
        price: 2799,
        whatYouWillLearn: "Python fundamentals, pandas for data manipulation, NumPy for numerical computing, data visualization, and statistical analysis.",
        tag: ["Python", "Data Science", "Pandas", "NumPy"],
        instructions: ["Basic programming knowledge", "Python installed", "Jupyter Notebook", "Mathematics basics"],
        thumbnail: "https://res.cloudinary.com/dqzlp8yfx/image/upload/v1692599180/Codehelp/python-data-science_ghi789.jpg",
        status: "Published"
      },
      {
        courseName: "Machine Learning Fundamentals",
        courseDescription: "Introduction to machine learning concepts, algorithms, and practical applications using Python and scikit-learn.",
        price: 3999,
        whatYouWillLearn: "ML algorithms, supervised & unsupervised learning, model evaluation, feature engineering, and real-world applications.",
        tag: ["Machine Learning", "Python", "Scikit-learn", "AI"],
        instructions: ["Python knowledge", "Statistics basics", "Linear algebra fundamentals", "Jupyter environment"],
        thumbnail: "https://res.cloudinary.com/dqzlp8yfx/image/upload/v1692599180/Codehelp/ml-course_jkl012.jpg",
        status: "Published"
      }
    ]
  },
  {
    categoryName: "Mobile App Development",
    courses: [
      {
        courseName: "React Native Mobile Apps",
        courseDescription: "Build cross-platform mobile applications using React Native. Learn to create iOS and Android apps with a single codebase.",
        price: 4299,
        whatYouWillLearn: "React Native fundamentals, navigation, state management, native modules, app deployment, and performance optimization.",
        tag: ["React Native", "Mobile Development", "iOS", "Android"],
        instructions: ["React.js knowledge", "Node.js setup", "Android Studio", "Xcode (for iOS)"],
        thumbnail: "https://res.cloudinary.com/dqzlp8yfx/image/upload/v1692599180/Codehelp/react-native-course_mno345.jpg",
        status: "Published"
      },
      {
        courseName: "Flutter App Development",
        courseDescription: "Create beautiful native mobile apps with Flutter and Dart. Learn Google's UI toolkit for mobile, web, and desktop.",
        price: 4199,
        whatYouWillLearn: "Dart programming, Flutter widgets, state management, animations, API integration, and app store deployment.",
        tag: ["Flutter", "Dart", "Mobile Development", "Cross-platform"],
        instructions: ["Programming basics", "Flutter SDK", "Android Studio", "Code editor"],
        thumbnail: "https://res.cloudinary.com/dqzlp8yfx/image/upload/v1692599180/Codehelp/flutter-course_pqr678.jpg",
        status: "Published"
      }
    ]
  },
  {
    categoryName: "Cloud Computing",
    courses: [
      {
        courseName: "AWS Cloud Fundamentals",
        courseDescription: "Learn Amazon Web Services from basics to advanced. Master EC2, S3, RDS, Lambda, and cloud architecture patterns.",
        price: 5499,
        whatYouWillLearn: "AWS core services, cloud architecture, security, scalability, cost optimization, and DevOps integration.",
        tag: ["AWS", "Cloud Computing", "DevOps", "Infrastructure"],
        instructions: ["Basic networking knowledge", "Linux fundamentals", "AWS account", "Command line basics"],
        thumbnail: "https://res.cloudinary.com/dqzlp8yfx/image/upload/v1692599180/Codehelp/aws-course_stu901.jpg",
        status: "Published"
      }
    ]
  }
]

async function createDemoCourses() {
  try {
    console.log("🚀 Creating demo courses for categories...")
    
    // Find the instructor user (we'll use the existing instructor)
    const instructor = await User.findOne({ accountType: "Instructor" })
    if (!instructor) {
      console.log("❌ No instructor found. Please create an instructor account first.")
      return
    }
    
    console.log(`👨‍🏫 Using instructor: ${instructor.firstName} ${instructor.lastName}`)
    
    for (const categoryData of demoCourses) {
      // Find the category
      const category = await Category.findOne({ name: categoryData.categoryName })
      if (!category) {
        console.log(`❌ Category "${categoryData.categoryName}" not found. Skipping...`)
        continue
      }
      
      console.log(`\n📚 Creating courses for category: ${categoryData.categoryName}`)
      
      for (const courseData of categoryData.courses) {
        // Check if course already exists
        const existingCourse = await Course.findOne({ courseName: courseData.courseName })
        if (existingCourse) {
          console.log(`   ⏭️  Course "${courseData.courseName}" already exists. Skipping...`)
          continue
        }
        
        // Create the course
        const newCourse = await Course.create({
          courseName: courseData.courseName,
          courseDescription: courseData.courseDescription,
          instructor: instructor._id,
          whatYouWillLearn: courseData.whatYouWillLearn,
          price: courseData.price,
          tag: courseData.tag,
          category: category._id,
          thumbnail: courseData.thumbnail,
          status: courseData.status,
          instructions: courseData.instructions,
          studentsEnroled: [], // Start with no students
          ratingAndReviews: [],
          courseContent: []
        })
        
        // Add course to instructor's courses
        await User.findByIdAndUpdate(
          instructor._id,
          { $push: { courses: newCourse._id } },
          { new: true }
        )
        
        // Add course to category
        await Category.findByIdAndUpdate(
          category._id,
          { $push: { courses: newCourse._id } },
          { new: true }
        )
        
        // Create a demo section and subsection for the course
        const demoSection = await Section.create({
          sectionName: "Introduction",
          courseId: newCourse._id,
          subSection: []
        })
        
        const demoSubSection = await SubSection.create({
          title: "Course Overview",
          timeDuration: "600", // 10 minutes
          description: "Get an overview of what you'll learn in this course",
          videoUrl: "https://www.youtube.com/watch?v=demo", // Demo video URL
          sectionId: demoSection._id
        })
        
        // Update section with subsection
        await Section.findByIdAndUpdate(
          demoSection._id,
          { $push: { subSection: demoSubSection._id } },
          { new: true }
        )
        
        // Update course with section
        await Course.findByIdAndUpdate(
          newCourse._id,
          { $push: { courseContent: demoSection._id } },
          { new: true }
        )
        
        console.log(`   ✅ Created course: "${courseData.courseName}" - ₹${courseData.price}`)
      }
    }
    
    console.log("\n🎉 Demo courses creation completed!")
    
  } catch (error) {
    console.error("❌ Error creating demo courses:", error)
  } finally {
    mongoose.connection.close()
    console.log("\n🔌 Database connection closed")
  }
}

// Run the script
createDemoCourses()
