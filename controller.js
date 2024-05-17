import { ObjectId } from 'bson';
import mongoose from 'mongoose';

await mongoose.connect("mongodb://127.0.0.1:27017/FarmToTable", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// CartProduct schema?
const CartProduct = new mongoose.Schema({
    itemid: String,                   // reference to product
    itemqty: Number
});

// Models
const User = mongoose.model("User", {
    fname: String,
    mname: String,
    lname: String,
    utype: String,
    email: String,
    password: String
}, 'users');

const Product = mongoose.model("Product", {
    pid: String,
    pname: String,
    pdesc: String,
    ptype: Number,
    pqty: Number
}, 'products');

const OrderTransaction = mongoose.model("OrderTransaction", {
    tid: String,
    pid: String,
    oqty: Number,
    ostatus: Number,
    email: String,
    date: Date,
    time: String
}, 'orderTransactions');

const ShoppingCart = mongoose.model("ShoppingCart", {
    cid: String,
    cart: [CartProduct]
}, 'shoppingCarts');



const homepage = (req, res) => {
    res.send("Welcome to Homepage!");
};


// Retrieve all
const users = async (req, res) => {
    const mem = await User.find();
    if (mem.length > 0) {
        res.send(mem);
    } else {
        res.send([]);
    }
};

const products = async (req, res) => {
    const mem = await Product.find();
    if (mem.length > 0) {
        res.send(mem);
    } else {
        res.send([]);
    }
};

const orderTransactions = async (req, res) => {
    const mem = await OrderTransaction.find();
    if (mem.length > 0) {
        res.send(mem);
    } else {
        res.send([]);
    }
};

    // Retrieve specific cart for Shopping cart
const userCart = async (req, res) => {
    const mem = await ShoppingCart.findOne({cid: req.query.id});
    res.send(mem);
};


// Saves
const saveUser = async (req, res) => {
    if (req.body.fname && req.body.lname && req.body.utype && req.body.email && req.body.password) {
        const newStudent = new User(req.body);
        await newStudent.save();

        // save a new cart 
        const id = newStudent._id
        const newCart = new ShoppingCart({cid: id});
        await newCart.save();

        res.json({ inserted: true });
    } else {
        res.json({ inserted: false });
    }
};

const saveProduct = async (req, res) => {
    if (req.body.pid && req.body.pname && req.body.pdesc && req.body.ptype && req.body.pqty) {
        const newStudent = new Product(req.body);
        await newStudent.save();
        res.json({ inserted: true });
    } else {
        res.json({ inserted: false });
    }
};

const saveOrderTransaction = async (req, res) => {
    if (req.body.tid && req.body.pid && req.body.oqty && req.body.ostatus && req.body.email && req.body.date && req.body.time) {
        const newStudent = new OrderTransaction(req.body);
        await newStudent.save();
        res.json({ inserted: true });
    } else {
        res.json({ inserted: false });
    }
};


// Updates
const updateProductQty = async (req, res) => {
    if (req.body.pid && req.body.pqty) {
        if (await Product.exists({ pid: req.body.pid })) {
            await Product.updateOne({pid: req.body.pid}, {$set: {pqty: req.body.pqty}})
            res.json({ udProdQtySuccess: true });
        } else {
            res.json({ udProdQtySuccess: false });
        }
    } else {
        res.json({ udProdQtySuccess: false });
    }
};

// For review - new addition
const saveCart = async (req, res) => {
    console.log(req.body.cid);
    console.log(req.body.cart);
    if (req.body.cid && req.body.cart) {
        if (await ShoppingCart.exists({cid: req.body.cid})) {
            //  update cart here
            res.json({ udCartSuccess: true });   
        } else {
            res.json({ udCartSuccess: false });
        }
    } else {
        res.json({ udCartSuccess: false });
    }
};

const updateUser = async (req, res) => {
    if (req.body._id) {
        var _id = ObjectId.createFromHexString(req.body._id)
        if (await User.exists({ _id: _id })){
            await User.updateOne({_id: _id}, {$set: req.body})
            res.json({ udUserSuccess: true });
        } else {
            res.json({ udUserSuccess: false });
        }
    } else {
        res.json({ udUserSuccess: false });
    }
};

const updateOrderTransaction = async (req, res) => {
    if (req.body.tid, req.body.ostatus) {
        if (await OrderTransaction.exists({ tid: req.body.tid })){
            await OrderTransaction.updateOne({tid: req.body.tid}, {$set: {ostatus: req.body.ostatus}});
            res.json({ udOrderTransactionSuccess: true });
        } else {
            res.json({ udOrderTransactionSuccess: false });
        }
    } else {
        res.json({ udOrderTransactionSuccess: false });
    }
};

// Deletes
const deleteProduct = async (req, res) => {
    if (req.body.pid) {
        if (await Product.exists({ pid: req.body.pid })){
            await Product.deleteOne({ pid: req.body.pid });
            res.json({ delProductSuccess: true });
        } else {
            res.json({ delProductSuccess: false }); 
        }
    } else {
        res.json({ delProductSuccess: false }); 
    }
};

const deleteUser = async (req, res) => {
    if (req.body.email) {
        if (await User.exists({ email: req.body.email })){
            const delUser = await User.findOne({email: req.body.email});
            await ShoppingCart.deleteOne({cid: delUser.id});
            await User.deleteOne({ email: req.body.email });
            res.json({ delUserSuccess: true });
        } else {
            res.json({ delUserSuccess: false });
        }
    } else {
        res.json({ delUserSuccess: false });
    }
};

export { homepage, users, products, orderTransactions, userCart, saveUser, saveProduct, saveOrderTransaction, updateProductQty, saveCart, updateUser, updateOrderTransaction, deleteProduct, deleteUser };
