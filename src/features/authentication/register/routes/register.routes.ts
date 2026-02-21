import express from 'express';
import { handleRegister } from '@/features/authentication/register/handlers/register.handler';
import { validate } from '@/middlewares/validate';
import { registerSchema } from '@/features/authentication/register/schemas/register.schema';

const register = express.Router();

register.post('/', validate(registerSchema), handleRegister);

export default register;
