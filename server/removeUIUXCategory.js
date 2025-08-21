const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');

async function removeUIUXCategory() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to database');

    // Find and delete the UI/UX Design category
    const result = await Category.deleteOne({ name: "UI/UX Design" });
    
    if (result.deletedCount > 0) {
      console.log('✅ UI/UX Design category removed successfully');
    } else {
      console.log('ℹ️ UI/UX Design category not found or already removed');
    }

    // List remaining categories
    const remainingCategories = await Category.find({}, 'name description');
    console.log('\nRemaining categories:');
    remainingCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database operation completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
  }
}

removeUIUXCategory();
