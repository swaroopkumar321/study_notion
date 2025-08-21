const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
const RatingAndReview = require('./models/RatingandReview');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/studynotion');
    
    const userId = '676147acfebffb049cc43483';
    const courseId = '676187806f3f7e6d7bec3fec'; // Nature course
    
    console.log('🔍 Checking enrollment status...');
    
    // Check course enrollment
    const course = await Course.findById(courseId).select('_id studentsEnroled courseName');
    console.log('Course found:', course ? course.courseName : 'No course found');
    console.log('Students enrolled:', course ? course.studentsEnroled.length : 0);
    
    if (course && course.studentsEnroled) {
      const isEnrolledInCourse = course.studentsEnroled.some(id => id.toString() === userId);
      console.log('User enrolled in course:', isEnrolledInCourse);
    }
    
    // Check user enrollment
    const user = await User.findById(userId).select('_id courses firstName lastName');
    console.log('User found:', user ? `${user.firstName} ${user.lastName}` : 'No user found');
    console.log('User courses:', user ? user.courses.length : 0);
    
    if (user && user.courses) {
      const isEnrolledInUser = user.courses.some(id => id.toString() === courseId);
      console.log('Course enrolled in user:', isEnrolledInUser);
    }
    
    // Test creating a review directly
    console.log('\n📝 Testing review creation...');
    
    // Check if review already exists
    const existingReview = await RatingAndReview.findOne({
      user: userId,
      course: courseId
    });
    
    if (existingReview) {
      console.log('⚠️ Review already exists:', existingReview._id);
      console.log('Existing rating:', existingReview.rating);
      console.log('Existing review:', existingReview.review);
    } else {
      console.log('✅ No existing review found - can create new review');
      
      // Create new review
      const newReview = await RatingAndReview.create({
        user: userId,
        course: courseId,
        rating: 5,
        review: 'Excellent Nature course! Very comprehensive and well-structured.'
      });
      
      console.log('✅ Review created successfully:', newReview._id);
      
      // Add review to course
      await Course.findByIdAndUpdate(courseId, {
        $push: { ratingAndReviews: newReview._id }
      });
      
      console.log('✅ Review added to course');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
})();
