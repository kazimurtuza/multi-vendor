import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js"
import cors from 'cors'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Auth service is running");
});

app.use("/api/auth",authRouter)

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Auth service is running on port ${port}`);
    connectDB();
});
