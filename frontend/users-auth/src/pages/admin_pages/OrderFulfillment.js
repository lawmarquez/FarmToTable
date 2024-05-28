import React, { useEffect, useState } from "react";
import '../pages_css/AdminAccount.css'

function OrderFulfillment() {
    const [products, setProducts] = useState([]);
    const [orderTransactions, setOrders] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, [products]);

    const fetchProducts = async () => {
        try{
            const products = await fetch('http://localhost:3001/products').then(response => response.json());
            setProducts(products);
        } catch (e) {
            console.error('Error fetching products:', e)
        }
    }

    useEffect(() => {
        fetchOrderTransactions();
    }, [orderTransactions]);

    const fetchOrderTransactions = async () => {
        try {
            const orders = await fetch('http://localhost:3001/orderTransactions').then(response => response.json());
            setOrders(orders);
        } catch (e) {
            console.error('Error fetching order transactions:', e);
        }
    };

    const completeOrderTransaction = async (transactionId) => {
        try{
            const response = await fetch('http://localhost:3001/update-ordertransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tid: transactionId,ostatus: 1})
            })

            if(response.ok){
                setOrders(orderTransactions.map(orderTransaction => (orderTransaction.tid === transactionId ? {...orderTransaction, ostatus: 1} : orderTransaction)));
            }else{
                console.error('Error completing order transaction:', response.statusText);
            }

        } catch (e) {
            console.error('Error completing order transaction:', e)
        }
    }

    const product = productId => {
        const prod = products.map((product) => (product.pid===productId? product.pname : ""))
        return prod
    }

    function status (ostatus) {
        switch(ostatus){
            case 1:
                return <span id="complete">Complete</span>
            case 2:
                return <span id="cancelled">Cancelled</span>
            default:
                return <span id="pending">Pending</span>
        }
    } 

    return(
        <>
            <div className="orderFulfillment"> 
            <h1 className="title">Order Fulfillment</h1>
                <div className="ordersGrid">
                {orderTransactions.map((orderTransaction, index) => (
                    <div className="orderTransaction">
                        <h2 id="orderNum">Order #{index+1}</h2>
                        <ul>
                            <li><span className="label">Order quantity:</span> {orderTransaction.oqty}</li>
                            <li><span className="label">Product: </span> {product(orderTransaction.pid)}</li>
                            <li><span className="label">Order status: </span> {status(orderTransaction.ostatus)}</li>
                            <li><span className="label">User email: </span> {orderTransaction.email}</li>
                            <li><span className="label">Date of transaction: </span> {orderTransaction.date.substring(0,10)}</li>
                            <li><span className="label">Time of transaction: </span> {orderTransaction.time}</li>
                        </ul>
                        {orderTransaction.ostatus===0? <button className="completeOrder" onClick={() => completeOrderTransaction(orderTransaction.tid)}>Complete</button> : <></>}
                        <br/>
                    </div>   
                ))}
                </div>
            </div>
        </>
        
    )
}

export default OrderFulfillment