import express from 'express';
import { validate } from '@/middlewares/validate';
import { handleLogin } from '../handlers/login.handler';
import { loginSchema } from '../schemas/login.schema';

const login = express.Router();

login.post('/', validate(loginSchema), handleLogin);

export default login;
