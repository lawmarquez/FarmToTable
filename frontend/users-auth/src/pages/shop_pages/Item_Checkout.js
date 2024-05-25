import React, { useState, useEffect } from 'react';

/*
  Items to checkout component
    - displays all the items to chekout
*/

export default function CheckoutItems(props) {

  const checkoutList = props.list;
  const prodList = props.prods;

  return (
    <>
      <div>
        {checkoutList.map((item) => {
          const product = prodList.find(product => product.pid === item.itemid);
          return (
            <div key={item.id}>
              <h3>{product.pname} - ${product.price}</h3>
              <p>QTY: {item.itemqty}</p>
            </div>
          );
        })
      }   
      </div>
    </>
  );
}