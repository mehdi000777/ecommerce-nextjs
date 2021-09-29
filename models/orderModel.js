import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    cart: Array,
    total: {
        type: Number,
        required: true
    },
    paymentId: String,
    method: String,
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    delivered: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    dateOfPayment: Date
}, {
    timestamps: true
})

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;