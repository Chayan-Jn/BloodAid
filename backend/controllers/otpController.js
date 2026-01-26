import crypto from 'crypto'
import client from '../config/redisClient.js'
import nodemailer from 'nodemailer'

export const mailOTP = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const otp = crypto.randomInt(100000, 1000000)
    console.log('Otp will be sent')

    await client.set(`otp:${email}`, otp.toString(), { EX: 300 })
    console.log('otp is set in redis')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code for bloodAid is ${otp}. It will expire in 5 minutes.`,
    }

    await transporter.sendMail(mailOptions)
    console.log('OTP sent via Gmail SMTP')

    return res.status(200).json({ success: true, message: 'OTP sent successfully' })
  } 
  catch (err) {
    console.log('Email send error:', err)
    return res.status(500).json({
      success: false,
      message: 'Server Error occurred while sending OTP',
      error: err.message,
    })
  }
}

export const verifyOTP = async ({ email, otp }) => {
  try {
    const storedOTP = await client.get(`otp:${email}`)
    if (!storedOTP) {
      return false
    }
    if (otp === storedOTP) {
      await client.del(`otp:${email}`)
      return true
    }
    return false
  } 
  catch (err) {
    throw new Error(`Error verifying otp\n ${err}`)
  }
}
