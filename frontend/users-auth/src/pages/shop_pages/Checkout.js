import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import CheckoutItems from "./Item_Checkout.js";

import '../pages_css/shop_css/Checkout.css'

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
    // TODO: navigate to success page or show alert box
  };

 
  return (
    <>
      <div id='checkoutbody'>
        <div>
          <h2 id='msg1'>Ready to checkout?</h2>
          <h4 id='msg2'>Check your items here</h4>
        </div>
        
        
        <div id='checkoutinner'>
          <div id='checkoutitemsflex'>
            <div id='checkoutitemheaders'>
                <p id='header1'>Product</p>
                <p>Quantity</p>
                <p>Total Price</p>
              {/* <div className='tablehr top'>
                  <hr class="solid"></hr>
              </div> */}
            </div>
            <div className='tablehr top'>
                  <hr class="solid"></hr>
              </div>
            <div id='checkoutitemgrid'>
              <CheckoutItems list={cart} prods={products} qty={qty} amt={amt}/>
            </div>
            <div className='tablehr bottom'>
                <hr class="solid"></hr>
            </div>
            {/* ADDITION: Redirect to /shop on click */}
            <button id='tocartbtn'>Continue Shopping</button>

          </div>

          <div id='checkoutsummary'>
            <p id='checkoutsummarytitle'>Order Summary</p>
            <p>Payment Method: COD</p>
            <p>Total Items: {qty}</p>
            <div id='topaydetails'>
              <div className='detail'>
                <p>Subtotal:</p>
                <p>${amt}</p>
              </div>
              <div className='detail'>
                <p>Shipping:</p>
                <p>Free</p>
              </div>
            </div>
            <hr class="solid"></hr>
            <div id='totaltopay'>
              <p>Total:</p>
              <p>${amt}</p>
            </div>
            
            <button id='placeorderbtn' onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;