import express from 'express';
import DonationController from '../controllers/DonationController.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const router = express.Router();
router.post('/donate',authMiddleware,DonationController);

export default router;