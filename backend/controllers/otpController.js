import crypto from 'crypto'
import client from '../config/redisClient.js'
import fetch from 'node-fetch' 

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

        const response = await fetch(process.env.RAILWAY_EMAIL_API_URL + '/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            otp,
            secret: process.env.RAILWAY_EMAIL_API_SECRET, 
        }),
        })
        const result = await response.json()
        if (!result.success) {
        console.log('Railway email API failed:', result)
        return res.status(500).json({ success: false, message: 'Failed to send OTP' })
        }
        console.log('OTP sent via Railway email API')
            return res.status(200).json({ success: true, message: 'OTP sent successfully' })
    } 
    catch (err) {
        console.log(err)
        return res.status(500).json({
        success: false,
        message: 'Server Error occured while requesting OTP',
        error: err,
        })
    }
}


export const verifyOTP = async ({email,otp})=>{
    try{
        const storedOTP = await client.get(`otp:${email}`);
        if(!storedOTP){
            return false;
        }
        if(otp === storedOTP){
            await client.del(`otp:${email}`)
            return true;
        }
        return false;
    }
    catch(err){
        throw new Error(`Error verifying otp\n ${err} `)
    }
}
