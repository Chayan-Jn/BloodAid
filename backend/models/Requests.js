import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    requester: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    bloodType: { 
        type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
        required: true 
    },
    location: {
        state: { type: String, required: true },
        district: { type: String, required: true }
    },
    unitsNeeded: { 
        type: Number, 
        default: 1 
    },
    status: { 
        type: String, 
        enum: ["pending", "fulfilled", "cancelled"], 
        default: "pending" 
    }
}, { timestamps: true });

export default mongoose.model("Request", RequestSchema);
