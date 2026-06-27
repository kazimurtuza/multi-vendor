import mongoose from "mongoose";
const connectDB =  async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL as string,{ 
            dbName: "resturant"
        });
        console.log("MongoDB Connected Resturant");
    } catch (error) {
        console.log("Error Connecting to MongoDB:", error);
    }
}

export default connectDB;