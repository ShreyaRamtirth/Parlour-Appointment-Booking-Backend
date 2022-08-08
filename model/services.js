import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now().toLocaleString().split(',')[0]
    }
}, { collection: 'Service' });

export const Service = mongoose.model('Service', serviceSchema);
