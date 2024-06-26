/*
  For Review:
  - transferred methods from server.js
*/

import mongoose from "mongoose";
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const { sign } = jwt;
const SECRET_KEY = 'authentication'

//SCHEMA
import User from './models/UserSchema.js';
//import Product from "./models/ProductSchema.js";

// Models
const Product = mongoose.model("Product", {
  pid: String,
  pname: String,
  pdesc: String,
  ptype: Number,
  pqty: Number,
  price: Number
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

// CartProduct
const CartProduct = new mongoose.Schema({
  itemid: String,                   // reference to product
  itemqty: Number
});

const ShoppingCart = mongoose.model("ShoppingCart", {
  cid: String,                      // reference to user cart with or without items
  cart: [CartProduct]
}, 'shoppingCarts');


// From server.js: Authentication
const getReg = async (req, res) => {
  try {
    //Finding the user in the database
    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Unable to get users' });
  }
};

const register = async (req, res) => {
  try {
    const { fname, mname, lname, email, username, password } = req.body;
    //Password hashing for added security (10 as key rotation, normally 12 or 13)
    const hashedPassword = await hash(password, 10);
    const newUser = new User({
      fname,
      mname,
      lname,
      email,
      username,
      password: hashedPassword,
      type: "user"
    });
    await newUser.save();

    // NEW: save a new cart 
    const id = newUser._id
    const newCart = new ShoppingCart({ cid: id });
    await newCart.save();

    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    res.status(500).json({ error: 'Error registering new user' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //username comparison
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: 'Invalid Username or Password' });
    }

    //password comparison (since encrypted, use bcrypt to compare passwords)
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid Username or Password' });
    }

    const token = sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    const user_info = { userFName: user.fname, userLName: user.lname, userEmail: user.email, userType: user.type, userId: user._id };
    res.json({ message: 'Login Successful', token: token, user_info: user_info });
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
};


// Other funcs from dbCart here

// Added functions from dbCart

// Retrieving -----
// const users = async (req, res) => {
//   const mem = await User.find();
//   if (mem.length > 0) {
//       res.send(mem);
//   } else {
//       res.send([]);
//   }
// };

const users = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
}

const user_info = async (req, res) => {
  try {
    const email = req.params.email;
    //Finding user by email and returning user info
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}


const updateUser_info = async (req, res) => {
  try {
    //Getting personal info from the database which will be updated
    const { email, fname, mname, lname } = req.body;
    const user = await User.findOneAndUpdate({ email }, { fname, mname, lname }, { new: true });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}

//fetching products
const products = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

//fetching order transactions
const orderTransactions = async (req, res) => {
  try {
    const ot = await OrderTransaction.find();
    res.json(ot);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching order transactions' });
  }
};

//fetching order transactions by user specifically email
const orderTransaction_users = async (req, res) => {
  const email = req.params.email;

  // console.log(`Fetching order transactions for email: ${email}`); // Debug log

  try {
    const transactions = await OrderTransaction.find({ email: email });
    
    // console.log(`Found transactions: ${transactions.length}`); // Debug log

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching order transactions:', error); // Debug log
    res.status(500).json({ error: 'Failed to fetch order transactions' });
  }
};

// Find product by ID
const findProduct = async (req, res) => {
  try {
    let productId = req.params.productId;
    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }
    productId = productId.trim(); // Trim leading/trailing spaces
    //console.log('Product ID:', productId); // Debug log
    //Given productId, find the product in the database
    const product = await Product.findOne({ pid: productId });
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//updatinf order status using id
const updateOrderUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { ostatus } = req.body;

    // Find the transaction by ID and update the order status
    const updatedTransaction = await OrderTransaction.findByIdAndUpdate(
        id,
        { ostatus },
        { new: true } // Return the updated document
    );

    if (!updatedTransaction) {
        return res.status(404).send('Transaction not found');
    }

    res.json(updatedTransaction);
} catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send('Server error');
}
}

// Retrieve specific cart for Shopping cart
const userCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await ShoppingCart.findOne({ cid: id });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error finding shopping cart' });
  }

};

// Saving -----
const saveProduct = async (req, res) => {

  if (req.body.pid && req.body.pname && req.body.pdesc && req.body.ptype && req.body.pqty && req.body.price) {

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ inserted: true });
  } else {
    res.json({ inserted: false });
  }
};

const saveOrderTransaction = async (req, res) => {
  // * added tid back in
  if (
    typeof req.body.tid !== 'undefined' &&
    typeof req.body.pid !== 'undefined' &&
    typeof req.body.oqty !== 'undefined' &&
    typeof req.body.ostatus !== 'undefined' &&
    typeof req.body.date !== 'undefined' &&
    typeof req.body.time !== 'undefined'
  ) {
  
  // if (req.body.pid && req.body.oqty && req.body.ostatus && req.body.date  && req.body.time) {
    const newOrder = new OrderTransaction(req.body);
    // console.log("new order", newOrder);
    await newOrder.save();
    res.json({ inserted: true });
  } else {
    res.json({ inserted: false });
  }
};

const saveCart = async (req, res) => {
  //console.log(req.body.cid);
  //console.log(req.body.cart);  
  //if (req.body.cid && JSON.parse(req.body.cart)) {
  //   if (await ShoppingCart.exists({ cid: req.body.cid })) {
  //     await ShoppingCart.updateOne({ cid: req.body.cid }, { $set: { cart: JSON.parse(req.body.cart) } })
  //     res.json({ udCartSuccess: true });
  //   } else {
  //     console.log("cart non existent");
  //     res.json({ udCartSuccess: false });
  //   }
  // } else {
  //   console.log("incomplete body");
  //   res.json({ udCartSuccess: false });
  // }

  if (req.params.userId && req.body.cart) {
    try {
      // check if the cart exists using ID
      const existingCart = await ShoppingCart.findOne({ cid: req.params.userId });
      
      if (existingCart) {
        // updateexisting cart
        existingCart.cart = req.body.cart;
        await existingCart.save();
        res.json({ success: true, message: 'cart updated' });
      } else {
        // If not create new
        const newCart = new ShoppingCart({ cid: req.params.userId, cart });
        await newCart.save();
        res.json({ success: true, message: 'cart created' });
      }
    } catch (error) {
      console.error('error saving:', error);
      res.status(500).json({ success: false, message: 'error' });
    }
  } else {
    // console.log('Incomplete body');
    res.status(400).json({ success: false, message: 'incomplete body' });
  }
  
};


// Updating -----
const updateProductQty = async (req, res) => {
  if (req.body.pid && req.body.pqty) {
    if (await Product.exists({ pid: req.body.pid })) {
      await Product.updateOne({ pid: req.body.pid }, { $set: { pqty: req.body.pqty } })
      res.json({ udProdQtySuccess: true });
    } else {
      res.json({ udProdQtySuccess: false });
    }
  } else {
    res.json({ udProdQtySuccess: false });
  }
};

const updateUser = async (req, res) => {
  if (req.body._id) {
    var _id = ObjectId.createFromHexString(req.body._id)
    if (await User.exists({ _id: _id })) {
      await User.updateOne({ _id: _id }, { $set: req.body })
      res.json({ udUserSuccess: true });
    } else {
      res.json({ udUserSuccess: false });
    }
  } else {
    res.json({ udUserSuccess: false });
  }
};

const updateUserType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const user = await User.findByIdAndUpdate(id, { type }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error updating user type' });
  }
};

const updateOrderTransaction = async (req, res) => {
  if (req.body.tid, req.body.ostatus) {
    if (await OrderTransaction.exists({ tid: req.body.tid })) {
      await OrderTransaction.updateOne({ tid: req.body.tid }, { $set: { ostatus: req.body.ostatus } });
      res.json({ udOrderTransactionSuccess: true });
    } else {
      res.json({ udOrderTransactionSuccess: false });
    }
  } else {
    res.json({ udOrderTransactionSuccess: false });
  }
};


// Deletes -----
const deleteProduct = async (req, res) => {
  if (req.body.pid) {
    if (await Product.exists({ pid: req.body.pid })) {
      await Product.deleteOne({ pid: req.body.pid });
      res.json({ delProductSuccess: true });
    } else {
      res.json({ delProductSuccess: false });
    }
  } else {
    res.json({ delProductSuccess: false });
  }
};

// const deleteUser = async (req, res) => {
//   if (ObjectId.createFromHexString(req.body._id)) {
//       var _id = ObjectId.createFromHexString(req.body._id)
//       if (await User.exists({ _id: _id })){
//           await ShoppingCart.deleteOne({cid: _id});
//           await User.deleteOne({ _id : _id});
//           res.json({ delUserSuccess: true });
//       } else {
//           res.json({ delUserSuccess: false });
//       }
//   } else {
//       res.json({ delUserSuccess: false });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const _id = ObjectId.createFromHexString(id);
//     if (await User.exists({ _id: _id })) {
//       await ShoppingCart.deleteOne({ cid: _id });
//       await User.deleteOne({ _id: _id });
//     }
//     res.status(204).end();
//   } catch (err) {
//     res.status(500).json({ error: 'Error deleting user' });
//   }
// };

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const _id = new ObjectId(id);
    const userExists = await User.exists({ _id });

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    await ShoppingCart.deleteOne({ cid: _id });
    await User.deleteOne({ _id });

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};




export {
  getReg,
  register,
  login,
  users,
  user_info,
  updateUser_info,
  products,
  orderTransactions,
  orderTransaction_users,
  findProduct,
  updateOrderUser,
  userCart,
  saveProduct,
  saveOrderTransaction,
  updateProductQty,
  saveCart,
  updateUser,
  updateOrderTransaction,
  deleteProduct,
  deleteUser,
  updateUserType
};



