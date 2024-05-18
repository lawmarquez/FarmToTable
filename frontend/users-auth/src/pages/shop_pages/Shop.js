import React from 'react'

import Items from './Items.js'
import Cart from './Cart.js'

import '../pages_css/shop_css/Shop.css'


const sampleProducts =
[   {"id":1, "name": "Carrots", "price": 123},
    {"id":2, "name": "Eggs", "price": 15},
    {"id":3, "name": "Banana", "price": 34},
    {"id":4, "name": "Pumpkin", "price": 204},
    {"id":5, "name": "Potato", "price": 64},
]


function Shop() {
    // May 15 - A little lost on the routing used (di tulad ng sa Week10 sample), di ko na muna pinakialaman
    // Suggestion: display shop on user log in
    // OR: change destination of on user log in. Navigate to user home on successful log in.
    // stuff to display in the account page
    // shopping cart link somewhere

    return (
        <>
            <div className='wrapper'>
                <h2 className='shop-message'>Shop Message</h2>

                <div className='shop-content'>
                    
                    <Items list = {sampleProducts}/>
                
                    
                
                    <Cart list = {sampleProducts} /> 
                </div>
            </div>
            
        </>
        
       
    ) 
}

export default Shop