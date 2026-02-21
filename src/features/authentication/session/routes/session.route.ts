import { optionalAuth } from '@middlewares/auth';
import express from 'express';
import { handleAuthMe, handleLogout } from '../handlers/session.handler';

const session = express.Router();

session.post('/logout', handleLogout);

session.get('/me', optionalAuth, handleAuthMe);

export default session;
