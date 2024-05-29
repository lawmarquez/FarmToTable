import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


// import './pages_css/shop_css/Cart.css'

function Cart(props) {
  // Shopping Cart: accessed through the user home page

  // For navigating to checkout for testing
  const navigate = useNavigate();

  // const list = props.list;
  const {list, email, products, removeOneFromCart, removeFromCart, addOneToCart} = props;
  const [cartList, setCart] = useState(list);
  useEffect(() => {
    setCart(list);
  }, [list]);
  // const itemCount = props.count;

  // Calculate total quantity and price
  let totalQuantity = 0;
  let totalPrice = 0;
  cartList.forEach((item) => {
    const product = products.find((product) => product.pid === item.itemid);
    totalQuantity += item.itemqty;
    totalPrice += item.itemqty * product.price;
  });

  //console.log(cartList);

  // Check for invalid carts
  const handleCheckout = (event) => {
    event.preventDefault();
    if(totalQuantity == 0){
      alert("Your cart is empty");
    } else {
      navigate('/checkout', {state: {email, cartList, products, totalQuantity, totalPrice}});
    }
  };


  return (
    <>
      <div id='cart'>Shopping Cart
        <div id='cartList'>
        {cartList.map((item) => {
            const product = products.find(product => product.pid === item.itemid); // Define product here
            return (
              <div key={item.itemid} className="cartItem">
                <p className="itemName">{product.pname} - ${product.price.toFixed(2)}</p>
                <p className="itemPrice">QTY: {item.itemqty}</p>
                <div className="cart-buttons">
                <button onClick={() => removeOneFromCart(product)}>-</button>
                <button onClick={() => addOneToCart(product)}>+</button>
                <button className="remove" onClick={() => removeFromCart(product)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
        {/* <p id="total">Total items: {totalQuantity}</p>
        <p id="totalPrice">Total price: ${totalPrice.toFixed(2)}</p> */}

        <div className="cart-summary">
        <p>Total Items: {totalQuantity}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>

        {/* Buttons for checkout navigation testing */}
        {/* Pass products list and necessary info to checkout page */}
        <div className="checkout">
        <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
        </div>
        {/* ! Remove Save cart button */}
        {/* <button>Save Cart</button> */}
      </div>
    </>
  )
}

export default Cart