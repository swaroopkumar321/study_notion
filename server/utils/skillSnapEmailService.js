// Integration Example: How to use Skill-Snap Email Template
// Add this to your payment controller or email service

const { skillSnapCourseEmail } = require('../mail/templates/skillSnapCourseEmail');
const mailSender = require('../utils/mailSender');

// Example usage in payment success handler
const sendSkillSnapEnrollmentEmail = async (studentEmail, studentName, courseName, amount = 400) => {
  try {
    // Generate the email HTML
    const emailHTML = skillSnapCourseEmail(courseName, studentName, amount);
    
    // Send the email
    const emailResponse = await mailSender(
      studentEmail,
      "🚀 Welcome to Skill-Snap - Course Enrollment Confirmed!",
      emailHTML
    );
    
    console.log("✅ Skill-Snap enrollment email sent successfully:", emailResponse);
    return emailResponse;
  } catch (error) {
    console.error("❌ Error sending Skill-Snap enrollment email:", error);
    throw error;
  }
};

// Example usage in your payment verification endpoint:
/*
// In your payment controller (e.g., payments.js)
exports.verifyPayment = async (req, res) => {
  try {
    // ... your existing payment verification logic ...
    
    // After successful enrollment
    if (paymentSuccess) {
      // Send Skill-Snap branded email
      await sendSkillSnapEnrollmentEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        course.courseName,
        400 // or course.price
      );
      
      return res.status(200).json({
        success: true,
        message: "Payment verified and Skill-Snap enrollment email sent!"
      });
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
};
*/

module.exports = {
  sendSkillSnapEnrollmentEmail
};

// Test function - uncomment to test
/*
const testSkillSnapEmail = async () => {
  const testEmail = "test@example.com";
  const testName = "John Doe";
  const testCourse = "Advanced React Development";
  const testAmount = 400;
  
  try {
    await sendSkillSnapEnrollmentEmail(testEmail, testName, testCourse, testAmount);
    console.log("🎉 Test email sent successfully!");
  } catch (error) {
    console.log("❌ Test email failed:", error.message);
  }
};

// Uncomment the line below to test
// testSkillSnapEmail();
*/
