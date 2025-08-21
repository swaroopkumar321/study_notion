const mailSender = require('./utils/mailSender');
require('dotenv').config();

// Simple receipt email template
const simpleReceiptEmail = (customerName, courseName, amount, receiptDetails) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payment Receipt - Skill-Snap</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .receipt { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border: 1px solid #ddd; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px; }
        .row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; align-items: center; }
        .label { font-weight: bold; }
        .amount { font-size: 22px; font-weight: bold; color: #28a745; text-align: right; }
        .total-row { border-top: 2px solid #333; margin-top: 15px; padding-top: 15px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="logo">🚀 Skill-Snap</div>
            <div>Payment Receipt</div>
        </div>
        
        <div class="row">
            <span class="label">Receipt No:</span>
            <span>${receiptDetails.receiptNo}</span>
        </div>
        
        <div class="row">
            <span class="label">Date:</span>
            <span>${receiptDetails.date}</span>
        </div>
        
        <div class="row">
            <span class="label">Customer:</span>
            <span>${customerName}</span>
        </div>
        
        <div class="row">
            <span class="label">Course:</span>
            <span>${courseName}</span>
        </div>
        
        <div class="row">
            <span class="label">Payment ID:</span>
            <span>${receiptDetails.paymentId}</span>
        </div>
        
        <div class="row">
            <span class="label">Transaction ID:</span>
            <span>${receiptDetails.transactionId}</span>
        </div>
        
        <div class="row">
            <span class="label">Payment Method:</span>
            <span>Online Payment</span>
        </div>
        
        <div class="row total-row">
            <span class="label">Total Amount Paid:</span>
            <span class="amount">₹ ${amount}.00</span>
        </div>
        
        <div class="footer">
            <p><strong>Thank you for your payment!</strong></p>
            <p>This is an automatically generated receipt.</p>
            <p>For support: support@skill-snap.com | +91-9876-543210</p>
            <p>© 2025 Skill-Snap. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

// Generate random receipt details
const generateReceiptDetails = () => {
  const receiptNo = 'RCP' + Date.now().toString().slice(-8);
  const paymentId = 'pay_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const transactionId = 'txn_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const date = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return {
    receiptNo,
    paymentId,
    transactionId,
    date
  };
};

// Send receipt email
const sendReceiptEmail = async () => {
  try {
    const receiptDetails = generateReceiptDetails();
    
    console.log('🧾 Generating ₹600 Receipt...');
    console.log('📋 Receipt Details:');
    console.log(`   Receipt No: ${receiptDetails.receiptNo}`);
    console.log(`   Payment ID: ${receiptDetails.paymentId}`);
    console.log(`   Transaction ID: ${receiptDetails.transactionId}`);
    console.log(`   Date: ${receiptDetails.date}`);
    console.log('');
    
    const customerDetails = {
      name: "Swaroop Kumar",
      email: "swarooop2326@gmail.com",
      course: "Advanced JavaScript Mastery",
      amount: 600
    };
    
    const receiptHTML = simpleReceiptEmail(
      customerDetails.name,
      customerDetails.course,
      customerDetails.amount,
      receiptDetails
    );
    
    // Save receipt preview
    const fs = require('fs');
    fs.writeFileSync('receipt-preview.html', receiptHTML);
    console.log('📁 Receipt preview saved: receipt-preview.html');
    
    // Send email
    console.log('📧 Sending receipt email...');
    const emailResponse = await mailSender(
      customerDetails.email,
      `📄 Payment Receipt - Skill-Snap`,
      receiptHTML
    );
    
    console.log('✅ Receipt email sent successfully!');
    console.log('');
    console.log('📨 Receipt Summary:');
    console.log(`   Customer: ${customerDetails.name}`);
    console.log(`   Course: ${customerDetails.course}`);
    console.log(`   Amount: ₹${customerDetails.amount}`);
    console.log(`   Email: ${customerDetails.email}`);
    console.log(`   Receipt No: ${receiptDetails.receiptNo}`);
    console.log('');
    console.log('🎉 Check your email for the receipt!');
    
    return {
      success: true,
      receiptDetails,
      customerDetails
    };
    
  } catch (error) {
    console.error('❌ Error sending receipt:', error.message);
    return { success: false, error: error.message };
  }
};

// Run the receipt generation
sendReceiptEmail();

module.exports = {
  simpleReceiptEmail,
  generateReceiptDetails,
  sendReceiptEmail
};
