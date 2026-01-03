import express from 'express';
import { mailOTP } from '../controllers/otpController.js';

const router = express.Router();
router.post('/email-otp',mailOTP)

export default router;