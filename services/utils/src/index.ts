import express from "express";
import dotenv from "dotenv";
//import connectDB from "./config/db.js";
//import authRouter from "./routes/auth.js"
import cloudinary from "cloudinary"
import cors from "cors"
import uploadRouter from "./routes/cloudinary.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb",extended:true}))

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_SECRET_KEY } = process.env;

 if (!CLOUD_NAME && !CLOUD_API_KEY && !CLOUD_SECRET_KEY) {
     throw new Error("Missing Cloudinary environment variable");
 }

cloudinary.v2.config({ 
  cloud_name: 'my_cloud_name', 
  api_key: 'my_key', 
  api_secret: 'my_secret'
});

app.use(express.json());

app.use("/api",uploadRouter)

const port = process.env.PORT || 5003;

app.listen(port, () => {
    console.log(`Utils service is running on port ${port}`);
    //connectDB();
});