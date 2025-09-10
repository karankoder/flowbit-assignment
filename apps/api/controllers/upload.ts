import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { Request, Response } from 'express';
import { File } from '../models/file';

export const uploadFile = async (req: Request, res: Response) => {
  const body = req.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname: string) => {
        return {
          allowedContentTypes: ['application/pdf'],
          tokenPayload: JSON.stringify({
            pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        await File.create({
          fileUrl: blob.url,
          fileName: blob.pathname,
        });
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};
