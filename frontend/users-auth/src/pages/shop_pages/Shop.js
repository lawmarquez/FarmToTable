import React, { useEffect, useState } from 'react';

import Items from './Items.js'
import Cart from './Cart.js'

import '../pages_css/shop_css/Shop.css'

function Shop() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");               // * ADDITION: user email to pass to cart
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const user_id = localStorage.getItem('userId');
    setUserId(user_id);
  }, []);

  // * ADDITION: user email to pass to cart
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setEmail(email);
  });

  // Obtain products to display for sale
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/products`); // Adjust the endpoint if necessary
        console.log('Response:', response);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Obtain user cart
  useEffect(() => {
    if (userId) {
      const fetchCart = async () => {
        try {
          const response = await fetch(`http://localhost:3001/cart-by-user/${userId}`);
          if (response.ok) {
            const cartData = await response.json();
            setCart(cartData.cart); // Assuming the cart array is in cartData.cart
            console.log(cartData.cart);
            console.log(cart);
          } else {
            console.error('Failed to fetch cart:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      };
      fetchCart();
    }
  }, [userId]);

  //Updating the cart to DB
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


  //Adding to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.itemid === product.pid);
      let updatedCart;
      if (existingItem) {
        if (existingItem.itemqty + 1 <= product.pqty) {
          updatedCart = prevCart.map(item =>
            item.itemid === product.pid ? { ...item, itemqty: item.itemqty + 1 } : item);
        } else {
          alert("You have reached the maximum quantity available for this product.");

          return prevCart;
        }
      } else {
        if (product.pqty >= 1) {
          updatedCart = [...prevCart, { itemid: product.pid, itemqty: 1 }];
        } else if (product.pqty <= 0) {
          alert("There is no available stock in this product at the moment.")
          return prevCart;
        } else {
          return prevCart;
        }
      }
      updateCartInDatabase(updatedCart);
      return updatedCart;
    });
  };


  //RemovingOne
  const removeOneFromCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.itemid === product.pid);
      let updatedCart;
      if (existingItem) {
        if (existingItem.itemqty > 1) {
          updatedCart = prevCart.map(item =>
            item.itemid === product.pid
              ? { ...item, itemqty: item.itemqty - 1 }
              : item
          );
        } else {
          updatedCart = prevCart.filter(item => item.itemid !== product.pid);
        }
      } else {
        return prevCart;
      }
      updateCartInDatabase(updatedCart);
      return updatedCart;
    });
  };
  //AddingOne
  // 

  const addOneToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.itemid === product.pid);
      let updatedCart;

      if (existingItem) {
        if (existingItem.itemqty + 1 <= product.pqty) {
          updatedCart = prevCart.map(item =>
            item.itemid === product.pid
              ? { ...item, itemqty: item.itemqty + 1 }
              : item
          );
        } else {
          alert("You have reached the maximum quantity available for this product.");
          return prevCart;
        }
      } else {
        return prevCart;
      }

      updateCartInDatabase(updatedCart);
      return updatedCart;
    });
  };


  //Removing an item from cart
  const removeFromCart = (product) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.itemid !== product.pid);
      updateCartInDatabase(updatedCart);
      return updatedCart;
    });

  };

  return (
    <>
      <div className='shopwrapper'>
        <h2 className='shop-message'>Shop Message</h2>
        <div className='shop-content'>
          <div id='prodlistandsorting'>
            <Items list={products} addToCart={addToCart} />
          </div>
          <Cart list={cart} email={email} products={products} removeOneFromCart={removeOneFromCart} addOneToCart={addOneToCart} removeFromCart={removeFromCart} />
        </div>
      </div>
    </>
  )
}

export default Shop