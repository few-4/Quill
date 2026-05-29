import mongoose from "mongoose";
import config from "./config.js";

async function connectToDB () {
    try{
        await mongoose.connect(config.MONGO_URI)
    }catch(error){
        console.error("DB connection failed:", error.message);
        process.exit(1);
    }
}

export default connectToDB;