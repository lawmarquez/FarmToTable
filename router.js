import {homepage, users, products, orderTransactions, saveUser, saveProduct, saveOrderTransaction} from './controller.js'

const router = (app) =>{
    app.get('/', homepage);

    app.get('/users', users);
    app.get('/products', products);
    app.get('/orderTransactions', orderTransactions);

    app.post('/save-user', saveUser)
    app.post('/save-product', saveProduct)
    app.post('/save-order-transaction', saveOrderTransaction)

}
export default router;