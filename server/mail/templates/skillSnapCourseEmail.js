exports.skillSnapCourseEmail = (courseName, name, amount = 400) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8">
      <title>Skill-Snap Course Enrollment Confirmation</title>
      <style>
          body {
              background-color: #f8f9fa;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
              margin-top: 20px;
              margin-bottom: 20px;
          }
  
          .header {
              text-align: center;
              padding: 20px 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px 10px 0 0;
              margin: -20px -20px 30px -20px;
          }
  
          .logo {
              font-size: 28px;
              font-weight: bold;
              color: #ffffff;
              margin: 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
  
          .subtitle {
              color: #e0e6ff;
              font-size: 14px;
              margin-top: 5px;
          }
  
          .message {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 20px;
              color: #2c3e50;
              text-align: center;
          }
  
          .body {
              font-size: 16px;
              margin-bottom: 20px;
              text-align: left;
              line-height: 1.6;
          }
  
          .course-details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
          }
  
          .price-highlight {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
          }
  
          .price {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
          }
  
          .currency {
              font-size: 18px;
              opacity: 0.9;
          }
  
          .cta {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff;
              text-decoration: none;
              border-radius: 25px;
              font-size: 16px;
              font-weight: bold;
              margin: 20px auto;
              display: block;
              width: fit-content;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
  
          .cta:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
  
          .features {
              background-color: #fff;
              padding: 20px;
              border: 1px solid #e9ecef;
              border-radius: 8px;
              margin: 20px 0;
          }
  
          .feature-list {
              list-style: none;
              padding: 0;
          }
  
          .feature-item {
              padding: 8px 0;
              border-bottom: 1px solid #f1f3f4;
              position: relative;
              padding-left: 25px;
          }
  
          .feature-item:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #28a745;
              font-weight: bold;
          }
  
          .feature-item:last-child {
              border-bottom: none;
          }
  
          .support {
              font-size: 14px;
              color: #6c757d;
              margin-top: 30px;
              text-align: center;
              padding: 20px;
              background-color: #f8f9fa;
              border-radius: 8px;
          }
  
          .highlight {
              font-weight: bold;
              color: #667eea;
          }
  
          .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e9ecef;
              color: #6c757d;
              font-size: 12px;
          }
      </style>
  
  </head>
  
  <body>
      <div class="container">
          <div class="header">
              <div class="logo">🚀 Skill-Snap</div>
              <div class="subtitle">Accelerate Your Learning Journey</div>
          </div>
          
          <div class="message">🎉 Course Enrollment Successful!</div>
          
          <div class="body">
              <p>Dear <span class="highlight">${name}</span>,</p>
              
              <p>Congratulations! You have successfully enrolled in our premium course. Welcome to the Skill-Snap family! 🌟</p>
              
              <div class="course-details">
                  <h3 style="margin-top: 0; color: #2c3e50;">📚 Course Details</h3>
                  <p><strong>Course Name:</strong> <span class="highlight">${courseName}</span></p>
                  <p><strong>Platform:</strong> Skill-Snap Learning Hub</p>
                  <p><strong>Access:</strong> Lifetime Access</p>
                  <p><strong>Support:</strong> 24/7 Community Support</p>
              </div>
              
              <div class="price-highlight">
                  <p class="price"><span class="currency">₹</span> ${amount}</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Investment in Your Future</p>
              </div>
              
              <div class="features">
                  <h3 style="margin-top: 0; color: #2c3e50;">🎯 What You Get:</h3>
                  <ul class="feature-list">
                      <li class="feature-item">Comprehensive video tutorials</li>
                      <li class="feature-item">Downloadable resources & materials</li>
                      <li class="feature-item">Interactive assignments & projects</li>
                      <li class="feature-item">Certificate of completion</li>
                      <li class="feature-item">Direct access to instructor</li>
                      <li class="feature-item">Lifetime access to course updates</li>
                      <li class="feature-item">Community access for networking</li>
                  </ul>
              </div>
              
              <p>Ready to start your learning journey? Access your course dashboard now and begin transforming your skills!</p>
              
              <a class="cta" href="https://skill-snap.com/dashboard">🚀 Start Learning Now</a>
              
              <p style="text-align: center; margin-top: 30px;">
                  <strong>Next Steps:</strong><br>
                  1. Click the button above to access your dashboard<br>
                  2. Complete your profile setup<br>
                  3. Start with the first module<br>
                  4. Join our community forum
              </p>
          </div>
          
          <div class="support">
              <p><strong>Need Help? We're Here!</strong></p>
              <p>If you have any questions or need assistance, our support team is ready to help:</p>
              <p>📧 Email: <a href="mailto:support@skill-snap.com" style="color: #667eea;">support@skill-snap.com</a></p>
              <p>💬 Live Chat: Available 24/7 on our website</p>
              <p>📱 WhatsApp: +91-XXXX-XXXXXX</p>
          </div>
          
          <div class="footer">
              <p>© 2025 Skill-Snap. All rights reserved.</p>
              <p>This email was sent because you enrolled in a course with us.</p>
              <p>Follow us on: 
                  <a href="#" style="color: #667eea;">LinkedIn</a> | 
                  <a href="#" style="color: #667eea;">Twitter</a> | 
                  <a href="#" style="color: #667eea;">Instagram</a>
              </p>
          </div>
      </div>
  </body>
  
  </html>`;
};
