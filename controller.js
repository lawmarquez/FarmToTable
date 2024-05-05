import mongoose from 'mongoose';

await mongoose.connect("mongodb://127.0.0.1:27017/FarmToTable", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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

const homepage = (req, res) => {
    res.send("Welcome to Homepage!");
};


const users = async (req, res) => {
    const mem = await User.find();
    if (mem.length > 0) {
        res.send(mem);
    } else {
        res.send([]);
    }
};

const saveUser = async (req, res) => {
    if (req.body.fname && req.body.lname && req.body.utype && req.body.email && req.body.password) {
        const newStudent = new User(req.body);
        await newStudent.save();
        res.json({ inserted: true });
    } else {
        res.json({ inserted: false });
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

const saveProduct = async (req, res) => {
    if (req.body.pid && req.body.pname && req.body.pdesc && req.body.ptype && req.body.pqty) {
        const newStudent = new Product(req.body);
        await newStudent.save();
        res.json({ inserted: true });
    } else {
        res.json({ inserted: false });
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

const saveOrderTransaction = async (req, res) => {
    if (req.body.tid && req.body.pid && req.body.oqty && req.body.ostatus && req.body.email && req.body.date && req.body.time) {
        const newStudent = new OrderTransaction(req.body);
        await newStudent.save();
        res.json({ inserted: true });
    } else {
        res.json({ inserted: false });
    }
};

export { homepage, users, products, orderTransactions, saveUser, saveProduct, saveOrderTransaction };
