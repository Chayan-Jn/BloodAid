import express from 'express';
import RequestController from '../controllers/RequestController.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import { countRequestsInArea,CreateRequest,myRequests } from '../controllers/RequestController.js';

const router = express.Router();

router.get('/total-requests',authMiddleware,countRequestsInArea);
router.get('/my-requests',authMiddleware,myRequests)
router.post('/find-donor',authMiddleware,RequestController);
router.post('/make-request',authMiddleware,CreateRequest)
export default router;