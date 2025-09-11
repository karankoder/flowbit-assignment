import { NextFunction, Request, Response } from 'express';
import { Invoice } from '../models/invoice';
import ErrorHandler from '../middlewares/error';

export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newInvoice = new Invoice(req.body);
    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new ErrorHandler('Invoice already exists', 409));
    }
    next(error);
  }
};

export const getAllInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    next(error);
  }
};

export const getInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return next(new ErrorHandler('Invoice not found', 404));
    }
    res.status(200).json(invoice);
  } catch (error: any) {
    next(error);
  }
};

export const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Update request body:', req.body);
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedInvoice) {
      return next(new ErrorHandler('Invoice not found', 404));
    }
    res.status(200).json(updatedInvoice);
  } catch (error: any) {
    next(error);
  }
};

export const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return next(new ErrorHandler('Invoice not found', 404));
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};
