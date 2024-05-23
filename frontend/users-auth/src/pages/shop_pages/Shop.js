import React, { useEffect, useState } from 'react';

import Items from './Items.js'
import Cart from './Cart.js'

import '../pages_css/shop_css/Shop.css'


// const products =
// [   {"id":1, "name": "Carrots", "price": 123},
//     {"id":2, "name": "Eggs", "price": 15},
//     {"id":3, "name": "Banana", "price": 34},
//     {"id":4, "name": "Pumpkin", "price": 204},
//     {"id":5, "name": "Potato", "price": 64},
// ]






function Shop() {
    // May 15 - A little lost on the routing used (di tulad ng sa Week10 sample), di ko na muna pinakialaman
    // Suggestion: display shop on user log in
    // OR: change destination of on user log in. Navigate to user home on successful log in.
    // stuff to display in the account page
    // shopping cart link somewhere

    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const [cart, setCart] = useState([]);
    
    useEffect(() => {
        const user_id = localStorage.getItem('userId');
        setUserId(user_id);
      }, []);
      
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

    useEffect(() => {
      if(userId){
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
                item.itemid === product.pid ? { ...item, itemqty: item.itemqty + 1 }: item);
            } else {
              return prevCart;
            }
          } else {
            if (product.pqty >= 1) {
              updatedCart = [...prevCart, { itemid: product.pid, itemqty: 1 }];
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
          }else{
            return prevCart;
          }
          updateCartInDatabase(updatedCart);
            return updatedCart;
      });
  };
    //AddingOne
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
            return prevCart;
          }
        }else{
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
            <div className='wrapper'>
                <h2 className='shop-message'>Shop Message</h2>

                <div className='shop-content'>

                    <Items list={products} addToCart={addToCart} />

                    <Cart list ={cart} products = {products} removeOneFromCart={removeOneFromCart} addOneToCart={addOneToCart} removeFromCart={removeFromCart} />
                </div>
            </div>

        </>


    )
}

export default Shop