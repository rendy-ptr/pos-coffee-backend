import express from 'express';
import { registerCustomer } from '../../controllers/customer.controller.ts';

const router = express.Router();

router.post('/register', registerCustomer);

export default router;
