import React, { useState, useEffect } from 'react';

// import './pages_css/Cart.css'

export default function Items(props) {
  // Shopping Cart: accessed through the user home page

  const products = props.list;
  const [prodsList, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // useEffect to initialize products and sort them
  useEffect(() => {
    sortProducts(products, sortOption, sortOrder);
  }, [products, sortOption, sortOrder]);

  // Function to handle sorting option change
  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  // Function to handle sorting order change
  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Function to sort products
  const sortProducts = (productsToSort, option, order) => {
    let sortedProducts = [];
    if (option === 'name') {
      sortedProducts = [...productsToSort].sort((a, b) => a.pname.localeCompare(b.pname));
    } else if (option === 'price') {
      sortedProducts = [...productsToSort].sort((a, b) => a.price - b.price);
    } else if (option === 'type') {
      sortedProducts = [...productsToSort].sort((a, b) => a.ptype - b.ptype);
    } else if (option === 'quantity') {
      sortedProducts = [...productsToSort].sort((a, b) => a.pqty - b.pqty);
    }

    if (order === 'desc') {
      sortedProducts.reverse();
    }
    setProducts(sortedProducts);
  };

  const getTypeName = (type) => {
    switch (type) {
      case 1:
        return 'Staple';
      case 2:
        return 'Fruits and Vegetables';
      case 3:
        return 'Livestock';
      case 4:
        return 'Seafood';
      case 5:
        return 'Others';
      default:
        return 'Unknown';
    }
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
            <p className="prodPrice">${item.price.toFixed(2)}</p>
            <p className="prodType">{getTypeName(item.ptype)}</p>
            <p className="prodQty">QTY:{item.pqty}</p>
            <button onClick={null}>Add to Cart</button>
          </div>
        ))}
      </div>
    </>
  )
}

