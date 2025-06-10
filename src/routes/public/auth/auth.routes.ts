import express from 'express';
import {
  registerCustomer,
  // loginAuth,
} from '@/controllers/auth/auth.controller';

const auth = express.Router();

auth.post('/register', registerCustomer);
// auth.post('/login', loginAuth);

export default auth;
