import { Router } from 'express';
import * as invoiceController from '../controllers/invoice';

const router = Router();

router
  .get('/', invoiceController.getAllInvoices)
  .get('/:id', invoiceController.getInvoiceById)
  .put('/:id', invoiceController.updateInvoice)
  .delete('/:id', invoiceController.deleteInvoice);

export default router;
