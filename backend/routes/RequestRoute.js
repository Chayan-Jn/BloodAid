import express from 'express';
import RequestController from '../controllers/RequestController.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import { countRequestsInArea,CreateRequest,myRequests,changeRequestStatus,areaRequests } from '../controllers/RequestController.js';

const router = express.Router();

router.get('/total-requests',authMiddleware,countRequestsInArea);
router.get('/my-requests',authMiddleware,myRequests);
router.get('/my-area-requests',authMiddleware,areaRequests)
router.post('/find-donor',authMiddleware,RequestController);
router.post('/make-request',authMiddleware,CreateRequest);
router.put('/change-status',authMiddleware,changeRequestStatus);
export default router;