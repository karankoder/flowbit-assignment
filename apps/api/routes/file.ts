import { Router } from 'express';
import { uploadFile } from '../controllers/upload';

const router = Router();

router.post('/upload', uploadFile);

export default router;
