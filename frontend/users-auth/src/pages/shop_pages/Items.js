import React, { useState, useEffect } from 'react';

// import './pages_css/Cart.css'

export default function Items(props) {
  // Shopping Cart: accessed through the user home page

  const products = props.list;
  console.log(products)
  const [prodsList, setProducts] = useState(products);
  console.log(prodsList)
  console.log(products)
  const [sortOption, setSortOption] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // useStates

  // useEffect

  // addToCart func
  // Update prodsList when products props change
  useEffect(() => {
    setProducts(products);
  }, [products]);
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
      sortedProducts = [...prodsList].sort((a, b) => a.pname.localeCompare(b.pname));
    } else if (option === 'price') {
      sortedProducts = [...prodsList].sort((a, b) => a.price - b.price);
    } else if (option === 'type') {
      sortedProducts = [...prodsList].sort((a, b) => a.ptype - b.ptype);
    } else if (option === 'quantity') {
      sortedProducts = [...prodsList].sort((a, b) => a.pqty - b.pqty);
    };
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
          <option value="type">Type</option>
          <option value="quantity">Quantity</option>
        </select>
        <label htmlFor="sortOrder">Order: </label>
        <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className='productList'>
        {prodsList.map((item) => (
          <div key={item.pid} className="listItem">
            {/* <img src={item.image} alt={item.name}></img> */}
            <h3>{item.pname}</h3>
            <p className="prodPrice">${item.price}</p>
            <p className="prodType">Type:{item.ptype}</p>
            <p className="prodQty">QTY:{item.pqty}</p>
            {/* <button onClick={() => addToCart(item)}>Add to Cart</button> */}
          </div>
        ))}
      </div>
    </>
  )
}

