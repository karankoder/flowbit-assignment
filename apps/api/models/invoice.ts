import mongoose, { Schema, Document } from 'mongoose';

const LineItemSchema = new Schema(
  {
    description: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new Schema(
  {
    
    fileUrl: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    vendor: {
      name: { type: String, required: true },
      address: String,
      taxId: String,
    },
    invoice: {
      number: { type: String, required: true },
      date: { type: String, required: true },
      currency: String,
      subtotal: Number,
      taxPercent: Number,
      total: Number,
      poNumber: String,
      poDate: String,
      lineItems: { type: [LineItemSchema], required: true },
    },
  },
  {
    timestamps: true,
  }
);

export interface IInvoice extends Document {
  fileUrl: string;
  fileName: string;
  vendor: {
    name: string;
    address?: string;
    taxId?: string;
  };
  invoice: {
    number: string;
    date: string;
    currency?: string;
    subtotal?: number;
    taxPercent?: number;
    total?: number;
    poNumber?: string;
    poDate?: string;
    lineItems: {
      description: string;
      unitPrice: number;
      quantity: number;
      total: number;
    }[];
  };
  createdAt: string;
  updatedAt?: string;
}

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
