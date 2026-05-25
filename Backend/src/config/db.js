import mongoose from "mongoose";
import config from "./config.js";

async function connectToDB () {
    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("DB connected")
    }catch(error){
        console.log(error)
    }
}

export default connectToDB;