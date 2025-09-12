'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  ZoomInIcon,
  ZoomOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
} from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  onExtract: () => void;
  isExtracting: boolean;
  onUploadNew: () => void;
}

export default function PdfViewer({
  fileUrl,
  onExtract,
  isExtracting,
  onUploadNew,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    toast.success(`PDF loaded with ${numPages} pages.`);
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className='flex flex-col h-full'>
      <div className='bg-gray-100 dark:bg-gray-800 p-2 flex justify-center items-center gap-4 sticky top-0 z-10'>
        <Button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          variant='outline'
          size='icon'
        >
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <Button
          onClick={goToNextPage}
          disabled={pageNumber >= (numPages ?? 0)}
          variant='outline'
          size='icon'
        >
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
        <div className='w-px bg-gray-300 dark:bg-gray-600 h-6 mx-2' />
        <Button
          onClick={zoomOut}
          disabled={scale <= 0.5}
          variant='outline'
          size='icon'
        >
          <ZoomOutIcon className='h-4 w-4' />
        </Button>
        <span>{(scale * 100).toFixed(0)}%</span>
        <Button
          onClick={zoomIn}
          disabled={scale >= 2}
          variant='outline'
          size='icon'
        >
          <ZoomInIcon className='h-4 w-4' />
        </Button>

        <div className='w-px bg-gray-300 dark:bg-gray-600 h-6 mx-2' />
        <Button onClick={onExtract} disabled={isExtracting}>
          <SparklesIcon className='mr-2 h-4 w-4' />
          {isExtracting ? 'Extracting...' : 'Extract with AI'}
        </Button>
        <Button onClick={onUploadNew} variant='outline'>
          Upload New PDF
        </Button>
      </div>

      <div className='flex-1 overflow-auto'>
        <div
          className='min-h-full p-4'
          style={{
            display: 'flex',
            justifyContent: 'center',
            minWidth: 'max-content',
          }}
        >
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) =>
              toast.error(`Error while loading PDF: ${error.message}`)
            }
          >
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
        </div>
      </div>
    </div>
  );
}
