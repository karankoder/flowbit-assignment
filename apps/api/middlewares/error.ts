import { Request, Response, NextFunction } from 'express';

class ErrorHandler extends Error {
  statusCode: any;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

interface CustomError extends Error {
  statusCode?: number;
  message: string;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  err.message = err.message || 'Internal Server Error';
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
