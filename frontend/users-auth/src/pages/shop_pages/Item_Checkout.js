import React from 'react';

/*
  Items to checkout component
    - displays all the items to chekout
*/

export default function CheckoutItems(props) {

  const checkoutList = props.list;
  const prodList = props.prods;

  return (
    <>
      {checkoutList.map((item) => {
        const product = prodList.find(product => product.pid === item.itemid);
        return (
          <div className='checkout itemdetails' key={item.id}>
            <div className='grid img'>
              <img src='chayote.png' alt='product'></img>
            </div>
            <h3 className='grid itemname'>{product.pname}</h3>
            <p className='grid itemqty'>{item.itemqty}</p>
            <p className='grid itemprice'>${product.price.toFixed(2)}</p>
          </div>
        );
      })}   
    </>
  );
}