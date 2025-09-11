'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import { InvoiceData } from '../lib/invoiceData';

interface InvoiceFormProps {
  initialData: InvoiceData | null;
  fileId: string | null;
}

export default function InvoiceForm({ initialData, fileId }: InvoiceFormProps) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const updateByPath = (path: string[], value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newData: any = { ...prev };
      let obj: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i] as string;
        if (
          key &&
          obj &&
          typeof obj === 'object' &&
          obj[key] &&
          typeof obj[key] === 'object'
        ) {
          obj[key] = { ...obj[key] };
        }
        obj = obj[key];
      }
      const lastKey = path[path.length - 1] as string;
      if (lastKey && obj && typeof obj === 'object') {
        obj[lastKey] = value;
      }
      return newData;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const path = e.target.name.split('.');
    let value: any = e.target.value;
    if (e.target.type === 'number') {
      value = value === '' ? '' : Number(value);
    }
    updateByPath(path, value);
  };

  const handleLineItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newLineItems = prev.invoice.lineItems.map((item, i) => {
        if (i !== index) return item;
        let newItem = { ...item, [field]: value };
        let quantity =
          field === 'quantity' ? Number(value) : Number(item.quantity);
        let unitPrice =
          field === 'unitPrice' ? Number(value) : Number(item.unitPrice);
        if (!isNaN(quantity) && !isNaN(unitPrice)) {
          newItem.total = quantity * unitPrice;
        }
        return newItem;
      });
      return {
        ...prev,
        invoice: {
          ...prev.invoice,
          lineItems: newLineItems,
        },
      };
    });
  };

  const handleSave = async (invoiceId: string) => {
    try {
      console.log(invoiceId);
      const response = await apiClient.put(`invoices/${invoiceId}`, {
        formData,
      });

      toast.success('Invoice saved successfully!');
      setFormData(response.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save invoice.');
    }
  };

  if (!formData) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-muted-foreground'>
          Please upload a file and click "Extract with AI" to see the data.
        </p>
      </div>
    );
  }

  return (
    <div className='p-4 h-full overflow-y-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Extracted Data</h2>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => handleSave(formData._id)}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle>Vendor</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div>
              <Label htmlFor='vendor-name'>Name</Label>
              <Input
                id='vendor-name'
                name='vendor.name'
                value={formData.vendor.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor='vendor-address'>Address</Label>
              <Input
                id='vendor-address'
                name='vendor.address'
                value={formData.vendor.address || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor='vendor-taxid'>Tax ID</Label>
              <Input
                id='vendor-taxid'
                name='vendor.taxId'
                value={formData.vendor.taxId || ''}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='invoice-number'>Invoice Number</Label>
                <Input
                  id='invoice-number'
                  name='invoice.number'
                  value={formData.invoice.number}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='invoice-date'>Date</Label>
                <Input
                  id='invoice-date'
                  name='invoice.date'
                  value={formData.invoice.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='invoice-currency'>Currency</Label>
                <Input
                  id='invoice-currency'
                  name='invoice.currency'
                  value={formData.invoice.currency || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='invoice-subtotal'>Subtotal</Label>
                <Input
                  id='invoice-subtotal'
                  name='invoice.subtotal'
                  type='number'
                  value={formData.invoice.subtotal ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='invoice-taxpercent'>Tax %</Label>
                <Input
                  id='invoice-taxpercent'
                  name='invoice.taxPercent'
                  type='number'
                  value={formData.invoice.taxPercent ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='invoice-total'>Total Amount</Label>
                <Input
                  id='invoice-total'
                  name='invoice.total'
                  type='number'
                  value={formData.invoice.total ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='invoice-ponumber'>PO Number</Label>
                <Input
                  id='invoice-ponumber'
                  name='invoice.poNumber'
                  value={formData.invoice.poNumber || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='invoice-podate'>PO Date</Label>
                <Input
                  id='invoice-podate'
                  name='invoice.poDate'
                  value={formData.invoice.poDate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className='text-right'>Qty</TableHead>
                  <TableHead className='text-right'>Unit Price</TableHead>
                  <TableHead className='text-right'>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.invoice.lineItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Input
                        type='number'
                        value={item.quantity}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            'quantity',
                            Number(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Input
                        type='number'
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            'unitPrice',
                            Number(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Input value={item.total} disabled />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
