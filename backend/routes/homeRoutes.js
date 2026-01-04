import express from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const router = express.Router();
router.get('/hi',(req,res)=>res.status(200).json('hi'))
router.get('/verify',authMiddleware,(req,res)=>{
    res.status(200).json({
        success: true,
        message: 'Token valid',
        user: req.user
    })
})

export default router;