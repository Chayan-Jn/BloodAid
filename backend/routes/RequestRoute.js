import express from 'express';
import RequestController from '../controllers/RequestController.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const router = express.Router();
router.post('/find-donor',authMiddleware,RequestController);

export default router;