import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import errorHandler from './handlers/errorHandler.js';
import userRoutes from './modules/user/user.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import surveyRoutes from './modules/survey/survey.routes.js';

const app = express();
dotenv.config();

app.use(errorHandler);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser()); 
app.use(cors({ 
  origin: ['https://vue-survey-client.vercel.app/', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))

app.use((req,res,next)=>{
    console.log(`Incomming ${req.method} Request on URL : ${req.url}`);
    next();
});

mongoose.connect(process.env.MONGO, {})
  .then(() => console.log("Connected to MongoDB Database Successfully"))
  .catch((error) => console.log(`Error While Connecting to Database.${error}`));

import "./models/user.model.js";
import "./models/survey.model.js";


app.use('/api/auth', authRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
    res.send("Hello World from the backend of survey ❤️");
})

app.listen(process.env.PORT, () =>  console.log(`server is listening on http://localhost:${process.env.PORT}`))