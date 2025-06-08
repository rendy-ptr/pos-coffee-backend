import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './middlewares/logger.ts';
import apiRouter from './routes/api.ts';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use('/api', apiRouter);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
