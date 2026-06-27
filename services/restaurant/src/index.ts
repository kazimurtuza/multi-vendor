import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
//import authRouter from "./routes/auth.js"

dotenv.config();

const app = express();

app.use(express.json());

//app.use("/api/auth",authRouter)

const port = process.env.PORT || 5002;

app.listen(port, () => {
    console.log(`Restaurant service is running on port ${port}`);
    connectDB();
});