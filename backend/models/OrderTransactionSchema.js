import { Schema, model } from 'mongoose';

const OrderTransactionSchema = new Schema({
    tid: {
        type: String,
        required: true
    },
    pid: {
        type: String,
    },
    oqty: {
        type: Number,
        required: true
    },
    ostatus: {
        type: Number,   // 0 Pending, 1 Completed, 2 Cancelled
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    }, 
    time: {
        type: Time,
        required: true
    }
});

const OrderTransaction = model('OrderTransaction', OrderTransactionSchema);

export default OrderTransaction;