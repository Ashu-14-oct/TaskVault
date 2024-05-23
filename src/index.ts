import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./routes";
import './config/mongoose';

const PORT = 3000;
const app = express();

app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {    
    console.log(`server running on PORT ${PORT}`);
});