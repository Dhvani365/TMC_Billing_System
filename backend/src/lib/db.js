import mongoose from "mongoose";

export const connectDb = async() => {
    try{
        const conn = await mongoose.connect(process.env.DB_STRING);
        console.log("MongoDB Connected: ", conn.connection.host);
    } catch(error) {
        console.log("MongoDB Connection Error: ", error);
    }
};