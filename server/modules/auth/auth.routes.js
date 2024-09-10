import express from 'express';
import SignUp from './controllers/SignUp.js';
import SignIn from './controllers/SignIn.js';
import SignOut from './controllers/SignOut.js';

const authRoutes = express.Router();

authRoutes.post('/signup', SignUp);
authRoutes.post('/signin', SignIn);
authRoutes.post('/signout', SignOut);

export default authRoutes;