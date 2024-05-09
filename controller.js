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
}, 'user');

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
    console.log(mem);
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
// const addToCart = async (req, res) => {

// };






// Deletes








export { homepage, users, products, orderTransactions, userCart, saveUser, saveProduct, saveOrderTransaction };
