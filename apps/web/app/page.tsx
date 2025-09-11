'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import InvoiceForm from '@/components/InvoiceForm';
import PdfViewer from '@/components/PdfViewer';
import { InvoiceData } from '@/lib/invoiceData';
import apiClient from '@/lib/api';
import { PutBlobResult } from '@vercel/blob';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtract = async () => {
    if (!blob) return;
    setIsExtracting(true);
    try {
      const fileUrl = blob.url;
      const fileName = blob.pathname || 'uploaded.pdf';
      const model = 'groq';
      const response = await apiClient.post('files/extract', {
        fileUrl,
        fileName,
        model,
      });

      console.log('this is called befaltu');

      setInvoiceData(response.data);
    } catch (error: any) {
      const backendMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      toast.error(`Extraction failed: ${backendMessage}`);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <main className='flex h-screen max-h-screen flex-col'>
      <header className='flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h1 className='text-2xl font-bold text-gray-800 tracking-tight'>
          Invoice Extractor
        </h1>
        <Link href='/invoices'>
          <Button variant='outline'>View All Invoices</Button>
        </Link>
      </header>

      <div className='flex flex-1 overflow-hidden'>
        <div className='w-1/2 border-r flex flex-col'>
          {!blob && <FileUpload onUploadComplete={setBlob} />}
          <div className='flex-1 overflow-auto'>
            {blob ? (
              <PdfViewer
                fileUrl={blob.url}
                onExtract={handleExtract}
                isExtracting={isExtracting}
                onUploadNew={() => {
                  setBlob(null);
                  setInvoiceData(null);
                }}
              />
            ) : (
              <div className='flex items-center justify-center h-full'>
                <p className='text-muted-foreground'>
                  Please upload a PDF to view it.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='w-1/2 overflow-auto'>
          <InvoiceForm initialData={invoiceData} fileId={blob?.url ?? null} />
        </div>
      </div>
    </main>
  );
}
