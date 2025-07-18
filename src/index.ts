import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { httpLogger } from './middlewares/logger';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '@docs/openapi.json';
import apiRouter from './routes/api';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(httpLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
