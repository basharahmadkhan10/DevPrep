import mongoose from 'mongoose';
const connectDB=async ()=>{
    try{
        const connect= await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
        return connect.connection.db;


    }catch{
        console.log("MongoDB failed to connected");
        process.exit(1);
    }
}
export default connectDB;