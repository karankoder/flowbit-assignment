import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import fileRouter from './routes/file';
import invoiceRouter from './routes/invoice';

export const app = express();
export const backendUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_BACKEND_URL
    : process.env.BACKEND_URL;

export const frontendUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_FRONTEND_URL
    : process.env.FRONTEND_URL;

config({
  path: './data/config.env',
});

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use('/api/v1/files', fileRouter);
app.use('/api/v1/invoices', invoiceRouter);

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.get('/failure', (req, res) => {
  res.send('Failed to Login');
});
