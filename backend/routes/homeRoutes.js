import express from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import User from '../models/User.js';

const router = express.Router();
router.get('/hi',(req,res)=>res.status(200).json('hi'))

router.get('/verify',authMiddleware,async (req,res)=>{
    const user = await User.findById(req.user.userId);
    const userObj = user.toObject()  // Mongoose doc -> plain obj
    const { name, email, bloodType } = userObj
    res.status(200).json({
      success: true,
      message: 'Token valid',
      user: { name, email, bloodType }
    }) 
})



export default router;