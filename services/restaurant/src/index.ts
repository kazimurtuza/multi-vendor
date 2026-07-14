import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import restaurantRoutes from "./routes/restaurant.js"
//import authRouter from "./routes/auth.js"

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 5002;

app.use("/api/restaurant",restaurantRoutes)

app.listen(port, () => {
    console.log(`Restaurant service is running on port ${port}`);
    connectDB();
});