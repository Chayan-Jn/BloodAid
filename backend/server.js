import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import otpRoutes from './routes/otpRoutes.js'


dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());

app.use('/',authRoutes)
app.use('/',otpRoutes)

const connectToServer = async ()=>{
    try{
        await connectToDB()
        const server = app.listen(PORT,()=>{
            console.log(`Server Listening on port ${PORT}`);
        })
    }
    catch(err){
        console.log('Error while connecting to server ',err)
    }
}
connectToServer()

