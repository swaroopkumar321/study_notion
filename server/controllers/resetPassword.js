const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      })
    }

    // Generate 6-digit OTP instead of token
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        resetPasswordOTP: otp,
        resetPasswordExpires: Date.now() + 600000, // 10 minutes
      },
      { new: true }
    )
    console.log("DETAILS", updatedDetails)

    // Send OTP via email (no URL needed)
    await mailSender(
      email,
      "Password Reset OTP - StudyNotion",
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password for your StudyNotion account.</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <h3 style="color: #333; margin: 0;">Your OTP Code:</h3>
          <h1 style="color: #007bff; font-size: 36px; letter-spacing: 5px; margin: 10px 0;">${otp}</h1>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>This OTP is valid for <strong>10 minutes</strong> only</li>
          <li>Enter this OTP in the app to reset your password</li>
          <li>Do not share this OTP with anyone</li>
        </ul>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>StudyNotion Team</p>
      </div>
      `
    )

    res.json({
      success: true,
      message: "OTP Sent Successfully, Please Check Your Email and Enter the OTP",
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset OTP`,
    })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    console.log("Reset Password Request Body:", req.body);
    const { password, confirmPassword, otp, email } = req.body

    if (!password || !confirmPassword || !otp || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (email, otp, password, confirmPassword)",
      })
    }

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      })
    }
    
    console.log("Looking for user with email and OTP:", email, otp);
    const userDetails = await User.findOne({ 
      email: email,
      resetPasswordOTP: otp 
    })
    console.log("User found:", userDetails ? "Yes" : "No");
    
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Invalid OTP or Email",
      })
    }
    
    console.log("OTP expiry:", userDetails.resetPasswordExpires);
    console.log("Current time:", new Date(Date.now()));
    
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `OTP is Expired, Please Request a New OTP`,
      })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { 
        password: encryptedPassword,
        resetPasswordOTP: undefined,
        resetPasswordExpires: undefined
      },
      { new: true }
    )
    
    console.log("Password updated successfully for user:", updatedUser.email);
    
    res.json({
      success: true,
      message: `Password Reset Successful`,
    })
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    })
  }
}
