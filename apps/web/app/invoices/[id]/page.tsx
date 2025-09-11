'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { InvoiceData } from '@/lib/invoiceData';

import InvoiceForm from '@/components/InvoiceForm'; // Adjust this import path if needed
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/api';

export default function EditInvoicePage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchInvoice = async () => {
        setIsLoading(true);
        try {
          const response = await apiClient.get(`invoices/${id}`);
          setInvoiceData(response.data);
        } catch (error) {
          console.error('Failed to fetch invoice:', error);
          toast.error('Could not fetch invoice data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchInvoice();
    }
  }, [id, toast]);

  const handleUpdate = async (updatedData: InvoiceData) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/${id}`, updatedData);
      toast.success('Invoice updated successfully.');
      router.push('/invoices'); // Navigate back to the list after saving
    } catch (error) {
      console.error('Failed to update invoice:', error);
      toast.error('failed to update invoice');
    }
  };

  if (isLoading) {
    return <div className='container mx-auto py-8 text-center'>Loading...</div>;
  }

  if (!invoiceData) {
    return (
      <div className='container mx-auto py-8 text-center'>
        Invoice not found.
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8'>
      <Link href='/invoices'>
        <Button variant='ghost' className='mb-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to All Invoices
        </Button>
      </Link>
      <InvoiceForm initialData={invoiceData} />
    </div>
  );
}
