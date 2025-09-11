import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { Request, Response } from 'express';
import { NextFunction } from 'express';

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname: string) => {
        return {
          allowedContentTypes: ['application/pdf'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          console.log('File saved:');
        } catch (err) {
          console.error('Error saving file to DB:', err);
        }
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    next(error);
  }
};
