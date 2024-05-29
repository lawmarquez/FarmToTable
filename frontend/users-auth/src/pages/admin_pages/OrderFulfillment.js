import React, { useEffect, useState } from "react";
import '../pages_css/AdminAccount.css'

function OrderFulfillment() {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orderTransactions, setOrders] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, [products]);

    const fetchProducts = async () => {
        try {
            const products = await fetch('http://localhost:3001/products').then(response => response.json());
            setProducts(products);
        } catch (e) {
            console.error('Error fetching products:', e)
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [users])

    const fetchUsers = async () => {
        try {
            const users = await fetch('http://localhost:3001/users').then(response => response.json());
            setUsers(users);
        } catch (e) {
            console.error('Error fetching users.', e);
        }
    }

    useEffect(() => {
        fetchOrderTransactions();
    }, [orderTransactions]);

    const fetchOrderTransactions = async () => {
        try {
            const orders = await fetch('http://localhost:3001/orderTransactions').then(response => response.json());
            const indexedOrders = orders.map((order, index) => ({ ...order, index }));
            const sortedOrders = indexedOrders.sort((a, b) => a.ostatus - b.ostatus);
            setOrders(sortedOrders);
        } catch (e) {
            console.error('Error fetching order transactions:', e);
        }
    };

    const completeOrderTransaction = async (transactionId, orderQty, productId) => {
        const product = products.find(p => p.pid === productId);
        const productQuantity = product ? product.pqty : 0;

        if (productQuantity < 0) {
            alert("Order cannot be fulfilled due to insufficient stock.");
        } else if (orderQty > productQuantity) {
            alert("Order cannot be fulfilled because the order quantity exceeds the available stock.");
        } else {
            try {
                // Update order transaction status
                const response = await fetch('http://localhost:3001/update-ordertransaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tid: transactionId, ostatus: 1 })
                })

                if (response.ok) {
                    try {
                        // Get previous product quantity and new quantity after decrementing qty from order
                        const product = products.find(prod => prod.pid === productId);
                        const prevQty = product.pqty;
                        const newQty = prevQty - orderQty;

                        // Update product quantity
                        const result = await fetch('http://localhost:3001/update-productqty', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ pid: productId, pqty: newQty })
                        })

                        if (result.ok) {
                            setOrders(orderTransactions.map(orderTransaction => (orderTransaction.tid === transactionId ? { ...orderTransaction, ostatus: 1 } : orderTransaction)));
                        }
                    } catch (e) {
                        console.error('Error updating product quantity:', e);
                    }

                } else {
                    console.error('Error completing order transaction:', response.statusText);
                }

            } catch (e) {
                console.error('Error completing order transaction:', e)
            }
        }
    }

    const product = productId => {
        const prod = products.find(product => product.pid === productId);
        return prod ? prod.pname : "";
    }

    const productPrice = productId => {
        const prod = products.find(product => product.pid === productId);
        return prod ? parseFloat(prod.price) : 0;
    };

    const user = email => {
        const user = users.find(user => user.email === email);
        return user ? `${user.fname} ${user.lname}` : "";
    }

    function status(ostatus) {
        switch (ostatus) {
            case 1:
                return <span id="complete">Complete</span>
            case 2:
                return <span id="cancelled">Cancelled</span>
            default:
                return <span id="pending">Pending</span>
        }
    }

    const formatPrice = price => {
        return typeof price === 'number' && !isNaN(price) ? price.toFixed(2) : "N/A";
    };

    return (
        <>
            <div className="orderFulfillment">
                <div className="pageHeader">
                    <h1 className="title">Order Fulfillments</h1>
                    <span className="pageDescription">Displayed below are the product orders by Farm To Table Customers.</span>
                </div>
                <div className="ordersGrid">
                    {orderTransactions.map((orderTransaction, index) => (
                        <div className="orderTransaction" key={orderTransaction.tid}>
                            <h2 id="orderNum">Order #{orderTransaction.index + 1}</h2>
                            <ul>
                                <li><span className="label">Order quantity:</span> {orderTransaction.oqty}</li>
                                <li><span className="label">Product: </span> {product(orderTransaction.pid)}</li>
                                <li><span className="label">Total Price: </span> {formatPrice(productPrice(orderTransaction.pid))}</li>
                                <li><span className="label">Order status: </span> {status(orderTransaction.ostatus)}</li>
                                <li><span className="label">Buyer name: </span> {user(orderTransaction.email)}</li>
                                <li><span className="label">Buyer email: </span> {orderTransaction.email}</li>
                                <li><span className="label">Date of transaction: </span> {orderTransaction.date.substring(0, 10)}</li>
                                <li><span className="label">Time of transaction: </span> {orderTransaction.time}</li>
                            </ul>
                            {orderTransaction.ostatus === 0 ? <button className="completeOrder" onClick={() => completeOrderTransaction(orderTransaction.tid, orderTransaction.oqty, orderTransaction.pid)}>Complete</button> : <></>}
                            <br />
                        </div>
                    ))}
                </div>
            </div>
        </>

    )
}

export default OrderFulfillment