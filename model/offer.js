import mongoose from "mongoose";
const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    validTill: {
        type: Date,
    },
    isActive:{
        type:Boolean,
        require:true
    },
    off: {
        type: Number,
        required: true
    }
}, { collection: 'Offer' });

export const Offer = mongoose.model('Offer', offerSchema);
