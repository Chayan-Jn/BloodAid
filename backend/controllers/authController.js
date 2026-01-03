import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { verifyOTP } from './otpController.js'


export const Register = async (req,res)=>{
    try{
        const {email,password,otp} = req.body;
        const user = await User.findOne({email:email});
        if(user){
            return res.status(409).json({
                message:"User already exists",
                success:false
            })
        }
        const isOTPValid = await verifyOTP({email,otp});
        if(!isOTPValid){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }
        const salt = await bcrypt.genSalt(11);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            email:email,
            password:hashedPassword
        })
        return res.status(201).json({
            success:true,
            message:"User Created Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server Error occured while Registering",
            
        })
    }
}

export const Login = async (req,res)=>{
    try{
        const {email,password,otp,loginType} = req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email is required ",
            })
        }
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User doesn't exist"
            })
        }

        if(loginType === "password"){
            if(!password){
                return res.status(400).json({
                    success:false,
                    message:"All fields must be filled ",
                })
            }
            const verifyPassword = await bcrypt.compare(password,user.password);
            if(!verifyPassword){
                return res.status(401).json({
                    success:false,
                    message:"Invalid Credentials"
                })
            }
        }
        else if(loginType === "otp"){
            if(!otp){
                return res.status(400).json({
                    success:false,
                    message:"All fields must be filled ",
                })
            }
            const verifiedOTP = await verifyOTP({
                email:email,
                otp:otp
            })
            if(!verifiedOTP){
                return res.status(401).json({
                    success:false,
                    message:"Invalid OTP ",
                })
            }
        }
        const token = await jwt.sign(
            {
                userId:user._id,
                email:email
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn:"1h"
            }
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV == "production",
            maxAge:60*60*1000, // 1h
            sameSite:"strict"
        })
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
              id: user._id,
              email: user.email,
            },
        });
        
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server Error occured while Logging in",    
            error:err
        })
    }
}