import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import invoiceRouter from './routes/invoiceRouter';
import fileRouter from './routes/fileRouter';
import { errorMiddleware } from './middlewares/error';

export const app = express();

config({
  path: './data/config.env',
});

app.use(
  cors({
    origin: [process.env.LOCAL_FRONTEND_URL!, process.env.FRONTEND_URL!],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/v1/invoices', invoiceRouter);
app.use('/api/v1/files', fileRouter);

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.get('/failure', (req, res) => {
  res.send('Failed to Login');
});

app.use(errorMiddleware);
