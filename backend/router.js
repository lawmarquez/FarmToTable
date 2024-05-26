/*
  For Review:
  - transferred methods from server.js
*/

import {getReg, register, login, users, user_info, updateUser_info, products, orderTransactions, orderTransaction_users, findProduct, updateOrderUser, userCart, saveProduct, saveOrderTransaction, updateProductQty, saveCart, updateUser, updateOrderTransaction, deleteProduct, deleteUser, updateUserType} from './controller.js';

const router = (app) => {

  app.get('/register', getReg);
  app.post('/register', register);
  app.post('/login', login);

  // Added routes from dbCart
  app.get('/users', users);
  app.get('/user-info/:email', user_info);
  app.put('/user-info/update', updateUser_info);
  app.get('/products', products);
  app.get('/orderTransactions', orderTransactions);
  app.get('/cart-by-user/:id', userCart);

  // app.post('/save-user', saveUser);
  app.post('/save-product', saveProduct);
  app.post('/save-order-transaction', saveOrderTransaction);

  app.post('/update-productqty', updateProductQty);
  app.put('/save-cart/:userId', saveCart);
  app.post('/update-user', updateUser);
  app.post('/update-ordertransaction', updateOrderTransaction);
  app.get('/order-transactions/:email', orderTransaction_users);
  app.get('/find-product/:productId', findProduct);
  app.put('/update-order-status/:id', updateOrderUser);

  app.post('/delete-product', deleteProduct);
  app.delete('/delete-user/:id', deleteUser);
  app.put('/users/:id', updateUserType);

}

export default router;