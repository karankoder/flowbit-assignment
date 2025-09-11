import { Router } from 'express';
import { uploadFile } from '../controllers/upload';
import { extractDataFromPdf } from '../controllers/extract';

// console.log('Invoice route loaded');
const router = Router();

router.post('/upload', uploadFile);
router.post('/extract', extractDataFromPdf);

export default router;
