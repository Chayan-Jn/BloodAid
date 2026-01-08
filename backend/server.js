import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
import connectToDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import otpRoutes from './routes/otpRoutes.js'
import homeRoutes from './routes/homeRoutes.js'
import DonateRoute from './routes/DonorRoute.js'
import RequestRoute from './routes/RequestRoute.js'

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json());

app.use('/', authRoutes);
app.use('/', otpRoutes);
app.use('/', homeRoutes);
app.use('/api',DonateRoute);
app.use('/api',RequestRoute);

const connectToServer = async () => {
    try {
        await connectToDB()
        const server = app.listen(PORT, () => {
            console.log(`Server Listening on port ${PORT}`);
        })
    }
    catch (err) {
        console.log('Error while connecting to server ', err)
    }
}
connectToServer()

