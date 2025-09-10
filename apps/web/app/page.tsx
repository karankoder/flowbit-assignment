// apps/web/app/page.tsx
'use client'; // This page needs to be a client component to manage state
import FileUpload from '@/components/FileUpload';
import { type PutBlobResult } from '@vercel/blob';

import { useState } from 'react';

export default function Home() {
  // We'll use this state later to pass the upload result to the form
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  return (
    <main className='flex h-screen max-h-screen'>
      {/* Left Panel: PDF Viewer and Upload */}
      <div className='w-1/2 border-r flex flex-col'>
        <FileUpload onUploadComplete={setBlob} />

        {/* PDF Viewer Area */}
        <div className='flex-1 p-4'>
          {blob ? (
            <p>PDF will be displayed here. URL: {blob.url}</p>
          ) : (
            <p className='text-muted-foreground'>
              Please upload a PDF to view it.
            </p>
          )}
        </div>
      </div>

      {/* Right Panel: Data Form */}
      <div className='w-1/2'>
        {/* We will add the InvoiceForm component here */}
        <p className='p-4'>Right Panel</p>
      </div>
    </main>
  );
}
