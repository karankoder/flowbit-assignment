'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import apiClient from '@/lib/api';

interface Invoice {
  _id: string;
  fileName: string;
  vendor: { name?: string };
  invoice: { number?: string; total?: number; date?: string };
  createdAt: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchInvoices = async (query = '') => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/invoices?q=${query}`);
      setInvoices(response.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to fetch invoices.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchInvoices(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleDelete = async (invoiceId: string) => {
    try {
      await apiClient.delete(`/invoices/${invoiceId}`);
      toast.success('Invoice deleted successfully.');
      setInvoices((prev) => prev.filter((inv) => inv._id !== invoiceId));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete the invoice.'
      );
    }
  };

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h1 className='text-2xl font-bold text-gray-800 tracking-tight'>
          Invoices
        </h1>
        <Button onClick={() => router.push('/')} className='ml-4'>
          Upload New Invoice
        </Button>
      </div>
      <div className='mb-4'>
        <Input
          placeholder='Search by vendor or invoice number...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='max-w-sm'
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className='font-medium'>
                    {invoice.invoice?.number || 'N/A'}
                  </TableCell>
                  <TableCell>{invoice.vendor?.name || 'N/A'}</TableCell>
                  <TableCell>
                    ${invoice.invoice?.total?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell>
                    {invoice.invoice?.date
                      ? format(new Date(invoice.invoice.date), 'PPP')
                      : 'N/A'}
                  </TableCell>
                  <TableCell className='text-right space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => router.push(`/invoice/${invoice._id}`)}
                    >
                      View / Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='destructive' size='sm'>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the invoice.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(invoice._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
