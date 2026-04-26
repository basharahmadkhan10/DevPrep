import express from 'express';
import authRoutes from './routes/auth.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import cookie from 'cookie-parser' 
import cors from 'cors';
const app=express();
app.use(express.json());
app.use(cookie());
app.use(cors({
    origin:'https://dev1prep.onrender.com',
    credentials:true
}));
app.use('/api/v1/auth',authRoutes); 
app.use('/api/v1/interview',interviewRoutes);
export default app;
