const mongoose = require('mongoose');
const Course = require('./models/Course');

(async () => {
  try {
    await mongoose.connect('mongodb+srv://swaroopkumar799:xx4mw4CZOYI3yXA1@auth0.sdvipn5.mongodb.net/StudyNotionDB');
    
    const userId = '68a4d0e8f449a4c9ca5dfa7e';
    const courseId = '68a4e4c2bcd3f1679db08c46';
    
    console.log('Testing enrollment check logic...');
    console.log('User ID:', userId);
    console.log('Course ID:', courseId);
    
    // Test the exact logic from the controller
    const courseDoc = await Course.findById(courseId).select('_id studentsEnroled').lean();
    console.log('Course found:', !!courseDoc);
    
    if (courseDoc) {
      console.log('Students enrolled array:', courseDoc.studentsEnroled);
      console.log('Array length:', courseDoc.studentsEnroled ? courseDoc.studentsEnroled.length : 0);
      
      if (Array.isArray(courseDoc.studentsEnroled)) {
        courseDoc.studentsEnroled.forEach((id, index) => {
          console.log(`Student ${index}: ${id} (type: ${typeof id})`);
          console.log(`  toString(): ${id.toString()}`);
          console.log(`  Matches user: ${id.toString() === String(userId)}`);
        });
        
        const isEnrolled = courseDoc.studentsEnroled.some((id) => id && id.toString() === String(userId));
        console.log('Enrollment check result:', isEnrolled);
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
