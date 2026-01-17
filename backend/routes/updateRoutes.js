import express from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import Update from '../controllers/updateController.js';

const router = express.Router();
router.put('/user/update',authMiddleware,Update)

export default router;