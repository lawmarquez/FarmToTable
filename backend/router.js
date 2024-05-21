/*
  For Review:
  - transferred methods from server.js
*/

import {getReg, register, login, users, products, orderTransactions, userCart, saveProduct, saveOrderTransaction, updateProductQty, saveCart, updateUser, updateOrderTransaction, deleteProduct, deleteUser, updateUserType} from './controller.js';

const router = (app) => {

  app.get('/register', getReg);
  app.post('/register', register);
  app.post('/login', login);

  // Added routes from dbCart
  app.get('/users', users);
  app.get('/products', products);
  app.get('/orderTransactions', orderTransactions);
  app.get('/cart-by-user', userCart);

  // app.post('/save-user', saveUser);
  app.post('/save-product', saveProduct);
  app.post('/save-order-transaction', saveOrderTransaction);

  app.post('/update-productqty', updateProductQty);
  app.post('/save-cart', saveCart);
  app.post('/update-user', updateUser);
  app.post('/update-ordertransaction', updateOrderTransaction);

  app.post('/delete-product', deleteProduct);
  app.delete('/delete-user/:id', deleteUser);
  app.put('/users/:id', updateUserType);

}

export default router;