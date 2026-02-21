import express from 'express';
import registerRoutes from '../../../features/authentication/register/routes/register.routes';
import loginRoutes from '../../../features/authentication/login/routes/login.route';
import sessionRoutes from '../../../features/authentication/session/routes/session.route';

const authentication = express.Router();

authentication.use('/register', registerRoutes);
authentication.use('/login', loginRoutes);
authentication.use('/session', sessionRoutes);

export default authentication;
