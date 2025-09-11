'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { Button } from '@/components/ui/button';
import { FaCloudUploadAlt } from 'react-icons/fa';

interface FileUploadProps {
  onUploadComplete: (blob: PutBlobResult) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    let file: File | undefined;
    if ('dataTransfer' in event) {
      file = event.dataTransfer.files?.[0];
    } else {
      file = event.target.files?.[0];
    }
    if (!file) {
      toast.error('No file selected.');
      return;
    }
    setSelectedFile(file);
    setIsUploading(true);
    toast.info('Uploading file...');
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `${process.env.NEXT_PUBLIC_API_URL}/files/upload`,
      });
      if (!blob) {
        throw new Error('Failed to upload file.');
      }
      toast.success('File uploaded successfully!');
      onUploadComplete(blob);
      setSelectedFile(null);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setDragActive(false);
    handleUpload(e);
  };

  return (
    <div className='p-4 border-b'>
      <Label htmlFor='pdf-upload' className='font-semibold'>
        Upload PDF
      </Label>
      <div
        className={`flex flex-col items-center justify-center gap-2 mt-2 border-2 border-dashed rounded-md p-6 transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <FaCloudUploadAlt className='text-4xl text-blue-500 mb-2' />
        <span className='text-gray-600'>Drag & drop your PDF here, or</span>
        <Button
          type='button'
          onClick={() => inputFileRef.current?.click()}
          disabled={isUploading}
          className='mt-1'
        >
          Choose File
        </Button>
        <Input
          id='pdf-upload'
          ref={inputFileRef}
          type='file'
          accept='application/pdf'
          onChange={handleUpload}
          disabled={isUploading}
          className='hidden'
        />
        {selectedFile && (
          <div className='text-sm text-gray-700 mt-2'>
            Selected: {selectedFile.name}
          </div>
        )}
      </div>
    </div>
  );
}
