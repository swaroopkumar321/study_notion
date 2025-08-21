const mongoose = require("mongoose");
const Category = require("./models/Category");
require("dotenv").config();

// Sample categories to populate
const sampleCategories = [
  {
    name: "Web Development",
    description: "Learn modern web development technologies including HTML, CSS, JavaScript, React, Node.js, and more."
  },
  {
    name: "Data Science",
    description: "Master data analysis, machine learning, Python, R, and statistical modeling."
  },
  {
    name: "Mobile App Development",
    description: "Build mobile applications for iOS and Android using React Native, Flutter, or native technologies."
  },
  {
    name: "Artificial Intelligence",
    description: "Explore AI concepts, machine learning algorithms, neural networks, and deep learning."
  },
  {
    name: "Cloud Computing",
    description: "Learn cloud platforms like AWS, Azure, Google Cloud, and cloud architecture patterns."
  },
  {
    name: "Cybersecurity",
    description: "Master cybersecurity fundamentals, ethical hacking, network security, and information protection."
  },
  {
    name: "DevOps",
    description: "Learn CI/CD, Docker, Kubernetes, infrastructure automation, and DevOps best practices."
  },
  {
    name: "Database Management",
    description: "Master SQL, NoSQL databases, database design, and data management strategies."
  },
  {
    name: "Blockchain",
    description: "Learn blockchain technology, cryptocurrency, smart contracts, and decentralized applications."
  }
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Insert sample categories
    const insertedCategories = await Category.insertMany(sampleCategories);
    console.log(`Successfully inserted ${insertedCategories.length} categories:`);
    
    insertedCategories.forEach(cat => {
      console.log(`- ${cat.name}`);
    });

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
