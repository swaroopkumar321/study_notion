const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    // Configure transporter for Gmail service
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    let info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log("Email sent successfully:", info.response)
    return info
  } catch (error) {
    console.log("Mail sending error:", error.message)
    return error.message
  }
}

module.exports = mailSender
