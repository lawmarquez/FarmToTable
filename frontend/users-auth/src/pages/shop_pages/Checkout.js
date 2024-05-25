import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import CheckoutItems from "./Item_Checkout.js";

/*
  Implementation:
    - receive cart info from Cart by navigate params and useLocation.
    - pass cart items to item_checkout component to display list
*/

function Checkout() {
  const state = useLocation();
  const email = state.state.email;
  const cart = state.state.cartList;
  const products = state.state.products;
  const qty = state.state.totalQuantity;
  const amt = state.state.totalPrice;

  // * generate unique id to be used for this transaction

  // * saves to db for every unique item/product in cart
  const saveOrderTransactions = async (prodinfo, cartiteminfo) => {
    try {
      // console.log(prodinfo);
      // console.log(cartiteminfo);
      const response = await fetch('http://localhost:3001/save-order-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // tid: unique id here
          pid: prodinfo.pid,
          oqty: cartiteminfo.itemqty,
          ostatus: 0,
          email: email,
          date: new Date(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })
        })
      });
      
      console.log(response);

    } catch (error) {
      console.error('Error placing orders:', error);
    }
  };

  // * loop for every item in cart, save it to db
  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    cart.forEach((item) => {
      const product = products.find((prod) => prod.pid === item.itemid);
      console.log(item);
      console.log(product);
      saveOrderTransactions(product, item);
    });
    console.log(cart);
  };

 
  return (
    <>
      <div>
        <h2>Ready to checkout?</h2>
        <h4>Check your items here</h4>
        
        <div>
          Items to checkout
          <CheckoutItems list={cart} prods={products} qty={qty} amt={amt}/>
        </div>

        <div>
          <p>Total Items: {qty}</p>
          <p>Amount: ${amt}</p>
        </div>
        
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </>
  );
}

export default Checkout;