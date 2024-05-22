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
  const cart = state.state.cartList;
  const products = state.state.products;
  const qty = state.state.totalQuantity;
  const amt = state.state.totalPrice;
  console.log(state);
  console.log (state.state.cartList);
 
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
          <p>Total Items: ${qty}</p>
          <p>Amount: ${amt}</p>
        </div>
        
        <button>Place Order</button>
      </div>
    </>
  );
}

export default Checkout;