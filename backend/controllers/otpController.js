import nodemailer from 'nodemailer'
import crypto from 'crypto'
import client from '../config/redisClient.js';
  
export const mailOTP = async (req,res)=>{
    try{

        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                success: false,
                message: 'Email is required'
              })
        }
        const otp = crypto.randomInt(100000, 1000000);
        console.log("Otp will be sent")
        await client.set(`otp:${email}`,otp.toString(),{EX:300}); // 5 min expiry
        console.log('otp is set in redis');
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS, 
            },
        });
        console.log('transported created ');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,                     
            subject: 'OTP for BloodAid',  
            text: `Your OTP is ${otp}`     
        })
        console.log("OTP sent");
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Server Error occured while requesting OTP",
            error:err
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