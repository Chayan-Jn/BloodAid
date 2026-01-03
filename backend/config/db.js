import mongoose from "mongoose";


const connectToDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongo DB connected successfully');
    }
    catch(err){
        console.log('Error while connecting to DB ',err);
        process.exit(1);
    }
}

export default connectToDB;