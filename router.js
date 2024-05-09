import {homepage, users, products, orderTransactions, userCart, saveUser, saveProduct, saveOrderTransaction} from './controller.js'

const router = (app) =>{
    app.get('/', homepage);

    app.get('/users', users);
    app.get('/products', products);
    app.get('/orderTransactions', orderTransactions);
    app.get('/cart-by-user', userCart);

    app.post('/save-user', saveUser);
    app.post('/save-product', saveProduct);
    app.post('/save-order-transaction', saveOrderTransaction);
    app.post('/add-to-cart', addToCart );

}
export default router;