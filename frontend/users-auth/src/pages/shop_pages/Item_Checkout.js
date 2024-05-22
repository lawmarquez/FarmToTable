import React, { useState, useEffect } from 'react';

export default function CheckoutItems(props) {

  const checkoutList = props.list;
  const prodList = props.prods;

  console.log(checkoutList);
  console.log(prodList);

  
  return (
    <>
      <div>
        {checkoutList.map((item) => {
          const product = prodList.find(product => product.pid === item.itemid);
          console.log(product);
          return (
            <div key={item.id}>
              <h3>{product.name} - ${product.price}</h3>
              <p>QTY: {item.qty}</p>
            </div>
          );
        })
      }
          
      </div>
    </>
  );
}