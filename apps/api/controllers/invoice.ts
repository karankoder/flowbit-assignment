import { Request, Response } from 'express';
import { Invoice } from '../models/invoice';

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const newInvoice = new Invoice(req.body);
    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Error: Duplicate fileId. Invoice likely already exists.',
      });
    }
    res
      .status(500)
      .json({ message: 'Error creating invoice', error: error.message });
  }
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.q as string;
    let filter = {};

    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'i');
      filter = {
        $or: [{ 'vendor.name': regex }, { 'invoice.number': regex }],
      };
    }

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error fetching invoices', error: error.message });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error fetching invoice', error: error.message });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    console.log('Update request body:', req.body);
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    console.log('Invoice updated:', updatedInvoice);
    res.status(200).json(updatedInvoice);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error updating invoice', error: error.message });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error deleting invoice', error: error.message });
  }
};
