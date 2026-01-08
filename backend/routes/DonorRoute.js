import express from 'express';
import DonationController,{countDonorsInArea} from '../controllers/DonationController.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const router = express.Router();
router.post('/donate',authMiddleware,DonationController);
router.get('/total-donors',authMiddleware,countDonorsInArea)

export default router;