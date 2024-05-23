import React, { useEffect, useState } from "react";
import '../pages_css/AdminAccount.css'

function OrderFulfillment() {
    const [products, setProducts] = useState([]);
    const [orderTransactions, setOrders] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {   
    }, [products])

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
    }, []);

    useEffect(() => {
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

    const status = (ostatus) => {
        switch(ostatus){
            case 0:
                return "Pending"
            case 1:
                return "Complete"
            case 2:
                return "Cancelled"
        }
    } 

    return(
        <div className="orderTransactions"> Order Fulfillment
            {orderTransactions.map(orderTransaction => (
                <div className="orderTransaction">
                    <ul>
                        <li>Order quantity: {orderTransaction.oqty}</li>
                        <li>Order status: {status(orderTransaction.ostatus)}</li>
                        <li>User email: {orderTransaction.email}</li>
                        <li>Date of transaction: {orderTransaction.date}</li>
                        <li>Time of transaction: {orderTransaction.time}</li>
                        {orderTransaction.ostatus===0? <button className="completeOrder" onClick={() => completeOrderTransaction(orderTransaction.tid)}>Complete</button> : <></>}
                    </ul>
                    <br/>
                </div>   
            ))}
        </div>
    )
}

export default OrderFulfillment