import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    pid: {
        type: String,
        required: true
    },
    pname: {
        type: String,
        required: true
    },
    ptype: {
        type: Number,   // 1 Staple, 2 Fruits and Vegetables, 3 Livestock, 4 Seafood, 5 Others
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pdesc: {
        type: String,
        required: true
    }, 
    pqty: {
        type: Number,
        required: true
    }
});

const Product = model('Product', ProductSchema);

export default Product;