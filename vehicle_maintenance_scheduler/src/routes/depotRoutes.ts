import { Router } from 'express';
import depotController from '../controllers/depotController';

const router = Router();

router.get('/', depotController.getAllDepots);

export default router;