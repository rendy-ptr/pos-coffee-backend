import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.ts';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
