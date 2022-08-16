import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    }
}, { collection: 'Service' });

export const Service = mongoose.model('Service', serviceSchema);
