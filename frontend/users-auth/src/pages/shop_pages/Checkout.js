import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate} from "react-router-dom";
import { useHistory } from "react-router";
import CheckoutItems from "./Item_Checkout.js";
import { nanoid } from 'nanoid'

import '../pages_css/shop_css/Checkout.css'

/*
  Implementation:
    - receive cart info from Cart by navigate params and useLocation.
    - pass cart items to item_checkout component to display list
*/

function Checkout() {
  const state = useLocation();
  const email = state.state.email;
  const [cart, setCart] = useState(state.state.cartList);
  const products = state.state.products;
  const qty = state.state.totalQuantity;
  const amt = state.state.totalPrice;
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user_id = localStorage.getItem('userId');
    setUserId(user_id);
}, []);

  // * saves to db for every unique item/product in cart
  const saveOrderTransactions = async (prodinfo, cartiteminfo) => {
    try {
      // * generate unique id for this item
      const uid = nanoid();
      // console.log(uid);

      const response = await fetch('http://localhost:3001/save-order-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tid: uid,
          pid: prodinfo.pid,
          oqty: cartiteminfo.itemqty,
          ostatus: 0,
          email: email,
          date: new Date(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })
        })
      });
      
      console.log(response);

      if(response.ok){
        var success = document.getElementById("successmodal");
        success.style.display = "block";


        window.onclick = function(event) {
          if (event.target == success) {
            success.style.display = "none";
          }
        }

      }

    } catch (error) {
      console.error('Error placing orders:', error);
    }
  };

  const clearCart = async () => {
    const emptyCart = [];
    await updateCartInDatabase(emptyCart);
    // Update the local state or context to reflect the empty cart
    setCart(emptyCart);
  };

  const updateCartInDatabase = async (updatedCart) => {
    try {
      const response = await fetch(`http://localhost:3001/save-cart/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart: updatedCart })
      });
  
      if (!response.ok) {
        console.error('Failed to update cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };
  
  // * loop for every item in cart, save it to db
  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    
    try {
      for (const item of cart) {
        const product = products.find((prod) => prod.pid === item.itemid);
        if (product) {
          await saveOrderTransactions(product, item);
        } else {
          console.error(`Product with ID ${item.itemid} not found.`);
        }
      }
      
      
      
      // Show success modal or navigate to success page
      var success = document.getElementById("successmodal");
      success.style.display = "block";
    } catch (error) {
      console.error('Error placing orders:', error);
      // Handle error (e.g., display error message to the user)
    }
  };
  
  // * for going back to shop in cancelling and after order success
  const handleContinueShopping = async () => {
    var success = document.getElementById("successmodal");
    success.style.display = "none";
    // Clear the cart only after successfully saving all order transactions
    await clearCart();
    navigate(-1);
  }

  const handleGoBack = () => {
    navigate(-1);
  }
 
          

  return (
    <>
      <div id='checkoutbody'>
        <div>
          <h2 id='msg1'>Ready to checkout?</h2>
          <button id='gobackbtn' onClick={handleGoBack}>🡸</button>
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
                  <hr className="solid"></hr>
              </div>
            <div id='checkoutitemgrid'>
              <CheckoutItems list={cart} prods={products} qty={qty} amt={amt}/>
            </div>
            <div className='tablehr bottom'>
                <hr className="solid"></hr>
            </div>
            {/* ADDITION: Redirect to /shop on click */}
            <button onClick={handleContinueShopping} id='tocartbtn'>Continue Shopping</button>

          </div>

          <div id='checkoutsummary'>
            <p id='checkoutsummarytitle'>Order Summary</p>
            <p>Payment Method: COD</p>
            <p>Total Items: {qty}</p>
            <div id='topaydetails'>
              <div className='detail'>
                <p>Subtotal:</p>
                <p>${amt.toFixed(2)}</p>
              </div>
              <div className='detail'>
                <p>Shipping:</p>
                <p>Free</p>
              </div>
            </div>
            <hr className="solid"></hr>
            <div id='totaltopay'>
              <p>Total:</p>
              <p>${amt.toFixed(2)}</p>
            </div>
            
            <button id='placeorderbtn' onClick={handlePlaceOrder}>Place Order</button>


            <div id='successmodal'>
              <div className='modalcontent'>
                <p>Your order has been placed!</p>
                <span onClick={handleContinueShopping} className="close">Continue Shopping</span> 
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;