import mongoose from "mongoose";
const connectDB =  async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL as string,{ 
            dbName: "resturant"
        });
        console.log("MongoDB Connected Resturant");
    } catch (error) {
        console.log("Error Connecting to MongoDB:", error);
        // console.error("Error connecting to MongoDB:", error);
        // process.exit(1);

        // kazimurtuza
        // kazi1996
        // mongodb+srv://kazimurtuza:kazi1996@cluster0.taifmra.mongodb.net/
        
    }
}



export default connectDB;