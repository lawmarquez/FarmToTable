import React, { useState, useEffect } from 'react';


// import './pages_css/shop_css/Cart.css'

function Cart(props) {
  // Shopping Cart: accessed through the user home page

  // const list = props.list;
  const {list, products} = props;
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

  return (
    <>
      <div id='cart'>Shopping Cart
        <div id='cartList'>
        {cartList.map((item) => {
            // Find the product details using the item's pid
            const product = products.find(product => product.pid === item.itemid);
            return (
              <div key={item.pid} className="cartItem">
                <p className="itemName">{product.pname} - ${product.price.toFixed(2)}</p>
                <p className="itemPrice">QTY: {item.itemqty}</p>
              </div>
            );
          })}
        </div>
        <p id="total">Total items: {totalQuantity}</p>
        <p id="totalPrice">Total price: ${totalPrice.toFixed(2)}</p>
      </div>
    </>
  )
}

export default Cart