import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./routes";
import './config/mongoose';
import cookieParser from 'cookie-parser';

const PORT = 3000;
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {    
    console.log(`server running on PORT ${PORT}`);
});