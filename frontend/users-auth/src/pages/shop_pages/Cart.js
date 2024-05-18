import React from 'react'

// import './pages_css/shop_css/Cart.css'

function Cart(props) {
  // Shopping Cart: accessed through the user home page

  const list = props.list;
  // const itemCount = props.count;

  return (
    <>
      <div id='cart'>Shopping Cart
        <div id='cartList'>
          {list.map((item) => (
            <div key={item.id} className="cartItem">
                <p className="itemName">{item.name} - ${item.price}</p>
                <p className="itemPrice">QTY: {item.qty}</p>

                {/* <button className="removeBtn" onClick={() => props.func(item.item.id)}>X</button> */}
            </div>
          ))}
        </div>
        {/* <p id="total">Total items: {itemCount} </p> */}
      </div>
    </>
  )
}

export default Cart