import { homepage, users, products, orderTransactions, saveUser, saveProduct, saveOrderTransaction, updateProductQty, updateCart, updateUser, updateOrderTransaction, deleteProduct, deleteUser, deleteCartProduct } from './controller.js'

const router = (app) =>{
    app.get('/', homepage);

    app.get('/users', users);
    app.get('/products', products);
    app.get('/orderTransactions', orderTransactions);

    app.post('/save-user', saveUser);
    app.post('/save-product', saveProduct);
    app.post('/save-order-transaction', saveOrderTransaction);

    app.post('/update-productqty', updateProductQty);
    app.post('/update-cart', updateCart);
    app.post('/update-user', updateUser);
    app.post('/update-ordertransaction', updateOrderTransaction);

    app.post('/delete-product', deleteProduct);
    app.post('/delete-user', deleteUser);
    app.post('/delete-cartproduct', deleteCartProduct);
}
export default router;