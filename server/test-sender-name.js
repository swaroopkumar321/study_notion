const mailSender = require('./utils/mailSender');
require('dotenv').config();

const testEmail = async () => {
  try {
    console.log('📧 Testing Skill-Snap sender name...');
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #667eea; text-align: center;">✅ Skill-Snap Email Test</h1>
        <p>This email confirms that the sender name has been successfully updated to <strong>Skill-Snap</strong>!</p>
        <p>Check your email header - it should now show "Skill-Snap" instead of "StudyNotion | CodeHelp".</p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0;">🎉 Configuration Updated Successfully!</h2>
        </div>
        <p style="color: #28a745; font-weight: bold;">The sender name is now: Skill-Snap</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This is a test email to verify the sender name configuration change.
        </p>
      </div>
    `;
    
    const result = await mailSender(
      'swarooop2326@gmail.com',
      '🚀 Test Email - Skill-Snap Sender Name Updated!',
      htmlContent
    );
    
    console.log('✅ Test email sent successfully!');
    console.log('📨 Check your email - the sender should now be "Skill-Snap"');
    console.log('📧 Email sent to: swarooop2326@gmail.com');
    console.log('');
    console.log('🔍 What to check in your email:');
    console.log('  • Email sender should show: Skill-Snap');
    console.log('  • No longer shows: StudyNotion | CodeHelp');
    console.log('  • Subject line: 🚀 Test Email - Skill-Snap Sender Name Updated!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testEmail();
