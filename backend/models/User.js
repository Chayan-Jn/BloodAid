import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
    },
    age:{
        type:Number
    },
    bloodType:{
        type:String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    location: {
        district: String,
        city: String,
        state: String
    },
    gender:{
        type:String
    },
    profileComplete:{ // all the details have been filled
        type:Boolean
    },
    donationsDone: { type: Number, default: 0 },
    donationsReceived: { type: Number, default: 0 }
    
},{timestamps:true})

export default mongoose.model('User',Schema);