import express from 'express'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()
const app = express()
app.use(express.json())

const API_SECRET = process.env.API_SECRET || 'supersecretkey'

app.post('/send-otp', async (req, res) => {
  try {

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, 
        },
      })
    
        // Testing transporter on startup
        transporter.verify((err, success) => {
          if (err) console.error('Mailer error:', err)
          else console.log('Mailer ready to send messages')
        })
        const { email, otp, secret } = req.body
        if (!secret || secret !== API_SECRET) {
            return res.status(403).json({ success: false, message: 'Unauthorized' })
        }
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP required' })
         }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for BloodAid',
            text: `Your OTP is ${otp}`,
        })
        console.log(`OTP ${otp} sent to ${email}`)
        return res.status(200).json({ success: true, message: 'OTP sent successfully' })
    } 
    catch (err) {
        console.error('Error sending OTP:', err)
        return res.status(500).json({ success: false, message: 'Failed to send OTP', error: err })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Email service running on port ${PORT}`))
