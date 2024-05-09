import mongoose from 'mongoose';

await mongoose.connect("mongodb://127.0.0.1:27017/FarmToTable", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const User = mongoose.model("User", {
    fname: String,
    mname: String,
    lname: String,
    utype: String,
    email: String,
    password: String
}, 'user');

const Product = mongoose.model("Product", {
    pid: String,
    pname: String,
    pdesc: String,
    ptype: Number,
    pqty: Number
}, 'product');

const OrderTransaction = mongoose.model("OrderTransaction", {
    tid: String,
    pid: String,
    oqty: Number,
    ostatus: Number,
    email: String,
    date: Date,
    time: String
}, 'orderTransaction');

const ShoppingCart = mongoose.model("ShoppingCart", {
    cid: String,
    cart: [CartProduct]
}, 'shoppingCart');

// CartProduct schema?
const CartProduct = new Schema({
    itemid: String,                   // reference to product
    itemqty: Number
});



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
    const mem = await ShoppingCart.findById(req.id);
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
        await Product.updateOne({pid: req.body.pid}, {$set: {pqty: req.body.pqty}})
        res.json({ udProdQtySuccess: true });
    } else {
        res.json({ udProdQtySuccess: false });
    }
};

const updateCart = async (req, res) => {
    if (req.body.cid && req.body.cartProduct) {
        const shoppingCart = await ShoppingCart.findById(req.body.cid)
        shoppingCart.cart.push(req.body.cartProduct);
        await shoppingCart.save();
        res.json({ udCartSuccess: true });
    } else {
        res.json({ udCartSuccess: false });
    }
};

const updateUser = async (req, res) => {
    if (req.body.id) {
        await User.updateOne({id: req.body.id}, {$set: req.body})
        res.json({ udUserSuccess: true });
    } else {
        res.json({ udUserSuccess: false });
    }
    
};

const updateOrderTransaction = async (req, res) => {
    if (req.body.tid, req.body.ostatus) {
        await OrderTransaction.updateOne({tid: req.body.tid}, {$set: {ostatus: req.body.ostatus}});
        res.json({ udOrderTransaction: true });
    } else {
        res.json({ udOrderTransaction: false });
    }
};

// Deletes
const deleteProduct = async (req, res) => {
    if (req.body.pid) {
        await Product.deleteOne({ pid: req.body.pid });
        res.json({ deleteProductSuccess: true });
    } else {
        res.json({ deleteProductSuccess: false }); 
    }
};

const deleteUser = async (req, res) => {
    if (req.body.id) {
        await User.deleteOne({ id: req.body.id });
        await ShoppingCart.deleteOne({ cid: req.body.id });
        res.json({ deleteUserSuccess: true });
    } else {
        res.json({ deleteUserSuccess: false });
    }
};

const deleteCartProduct = async (req, res) => {
    if (req.body.cid, req.body.itemid) {
        const shoppingCart = await ShoppingCart.findById(req.body.cid);
        const filteredCart = shoppingCart.cart.filter(item => item.itemid!=req.body.itemid);
        await ShoppingCart.updateOne({cid: req.body.cid}, {$set: {cart: filteredCart }});
        res.json({ deleteCartProductSucess: true });
    } else {
        res.json({ deleteCartProductSucess: false });
    }
}


export { homepage, users, products, orderTransactions, saveUser, saveProduct, saveOrderTransaction, updateProductQty, updateCart, updateUser, updateOrderTransaction, deleteProduct, deleteUser, deleteCartProduct };
