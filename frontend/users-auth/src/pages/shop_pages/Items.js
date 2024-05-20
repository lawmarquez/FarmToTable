import React from 'react'
import { useState } from "react";

// import './pages_css/Cart.css'

export default function Items(props) {
  // Shopping Cart: accessed through the user home page

  const products = props.list;
  const [prodsList, setProducts] = useState(products);
  
  // useStates

  // useEffect

  // addToCart func

  return (
    <>
      <div className='productList'>
        {prodsList.map((item) => (
            <div key={item.id} className="listItem"> 
              {/* <img src={item.image} alt={item.name}></img> */}
              <h3>{item.name}</h3>
              <p className="prodPrice">${item.price}</p>
              {/* <button onClick={() => addToCart(item)}>Add to Cart</button> */}
            </div>
        ))}
      </div>
    </>
  )
}

