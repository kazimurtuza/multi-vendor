import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import restaurantRoutes from "./routes/restaurant.js"
//import authRouter from "./routes/auth.js"
import cors from "cors"

import menuItemRoutes from "./routes/menuItem.js"

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
const port = process.env.PORT || 5002;
app.use("/api/restaurant", restaurantRoutes)
app.use("/api/item", menuItemRoutes)

app.listen(port, () => {
    console.log(`Restaurant service is running on port ${port}`);
    connectDB();
});