import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    scientificName: String,
    category: {
        type: String,
        enum: ['Raw Herb', 'Processed', 'Oil', 'Other'],
        default: 'Raw Herb'
    },
    image: String, // URL or path
    stock: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        default: 'kg'
    },
    pricePerUnit: Number,
    expiryDate: Date
}, {
    timestamps: true
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
