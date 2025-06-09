import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { httpLogger } from './middlewares/logger';
import apiRouter from './routes/api';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(httpLogger);

app.use('/api', apiRouter);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
