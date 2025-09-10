'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

// Define the props interface to pass the result to the parent
interface FileUploadProps {
  onUploadComplete: (blob: PutBlobResult) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];

    if (!file) {
      toast.error('No file selected.');
      return;
    }

    setIsUploading(true);
    toast.info('Uploading file...');

    try {
      const blob = await upload(file.name, file, {
        access: 'public', // Or private
        handleUploadUrl: 'http://localhost:4000/api/v1/files/upload',
      });

      //   if (!response.ok) {
      //     throw new Error('Failed to upload file.');
      //   }

      //   const newBlob = (await response.json()) as PutBlobResult;
      console.log(blob.url);
      toast.success('File uploaded successfully!');
      //   onUploadComplete(newBlob);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='p-4 border-b'>
      <Label htmlFor='pdf-upload' className='font-semibold'>
        Upload PDF
      </Label>
      <div className='flex gap-2 mt-2'>
        <Input
          id='pdf-upload'
          ref={inputFileRef}
          type='file'
          accept='application/pdf'
          onChange={handleUpload}
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
