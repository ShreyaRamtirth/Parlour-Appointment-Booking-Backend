import express from "express";
import bodyParser from 'body-parser';
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

import requireAuth from "./middleware/auth.js";
import adminRoutes from './routes/adminRoutes.js'
import publicRoute from './routes/publicRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import employeeRoutes from './routes/employeeRoutes.js'
import adminAuth from './middleware/adminAuth.js';
import employeeAuth from './middleware/employeeAuth.js';
import customerAuth from './middleware/customerAuth.js';


dotenv.config()

mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Database connected");
});
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "*"
}));
app.use(bodyParser.json());
app.use('/user', publicRoute);
app.use('/customer', requireAuth, customerAuth, customerRoutes);
app.use('/employee', requireAuth, employeeAuth, employeeRoutes);
app.use('/admin', requireAuth, adminAuth, adminRoutes);

app.listen(PORT, () => console.log(`Server is runnning on port : http://localhost:${PORT}`));