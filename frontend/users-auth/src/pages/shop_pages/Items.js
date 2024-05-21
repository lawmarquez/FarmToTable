import React from 'react'
import { useState } from "react";

// import './pages_css/Cart.css'

export default function Items(props) {
  // Shopping Cart: accessed through the user home page

  const products = props.list;
  const [prodsList, setProducts] = useState(products);
  const [sortOption, setSortOption] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // useStates

  // useEffect

  // addToCart func

  // Function to handle sorting
  const handleSortOptionChange = (event) => {
    const option = event.target.value;
    setSortOption(option);
    sortProducts(option, sortOrder);
  };

  const handleSortOrderChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);
    sortProducts(sortOption, order);
  };


  // Function to sort products
  const sortProducts = (option, order) => {
    let sortedProducts = [];
    if (option === 'name') {
      sortedProducts = [...prodsList].sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'price') {
      sortedProducts = [...prodsList].sort((a, b) => a.price - b.price);
    }
    if (order === 'desc') {
      sortedProducts.reverse();
    }
    setProducts(sortedProducts);
  };

  return (
    <>
      <div className='sorting'>
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortOptionChange}>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
        <label htmlFor="sortOrder">Order: </label>
        <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

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

