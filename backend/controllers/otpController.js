import crypto from 'crypto'
import client from '../config/redisClient.js'
import { google } from 'googleapis'

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
)

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

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

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

    const emailContent = [
      `From: "bloodAid" <${process.env.EMAIL_USER}>`,
      `To: ${email}`,
      'Subject: Your OTP Code',
      '',
      `Your OTP code for bloodAid is ${otp}. It will expire in 5 minutes.`
    ].join('\n')

    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage }
    })

    console.log('OTP sent via Gmail API')
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
