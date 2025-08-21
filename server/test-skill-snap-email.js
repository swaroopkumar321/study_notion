const { skillSnapCourseEmail } = require('./mail/templates/skillSnapCourseEmail');
const fs = require('fs');

// Test data
const testName = "John Doe";
const testCourseName = "Full Stack Web Development Masterclass";
const testAmount = 400;

// Generate the email HTML
const emailHTML = skillSnapCourseEmail(testCourseName, testName, testAmount);

// Save to a file so you can open it in a browser to see how it looks
fs.writeFileSync('skill-snap-email-preview.html', emailHTML);

console.log('📧 Skill-Snap Email Template Generated!');
console.log('✅ Email HTML saved to: skill-snap-email-preview.html');
console.log('\n📋 Email Details:');
console.log(`👤 Recipient: ${testName}`);
console.log(`📚 Course: ${testCourseName}`);
console.log(`💰 Amount: ₹${testAmount}`);
console.log('\n🌟 Features of this email template:');
console.log('• Modern gradient design with Skill-Snap branding');
console.log('• Responsive layout that works on mobile and desktop');
console.log('• Professional styling with hover effects');
console.log('• Clear course details and pricing information');
console.log('• Feature list highlighting course benefits');
console.log('• Multiple contact options for support');
console.log('• Call-to-action button to start learning');
console.log('• Social media links and footer');
console.log('\n🚀 Ready to use in your application!');

// Display a portion of the HTML for verification
console.log('\n📄 Email HTML Preview (first 500 characters):');
console.log(emailHTML.substring(0, 500) + '...\n');
