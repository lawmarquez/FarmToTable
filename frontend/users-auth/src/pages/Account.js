import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages_css/Account.css';

function Account() {
    const [email, setEmail] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [userInfo, setUserInfo] = useState({ fname: '', mname: '', lname: '' });
    const [editMode, setEditMode] = useState(false);
    const [newUserInfo, setNewUserInfo] = useState({ fname: '', mname: '', lname: '' });

    // Getting email from local storage from Login.js
    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
            fetchUserInfo(storedEmail);
        }
    }, []);

    // Getting user info from the database (for ediitng personal info)
    const fetchUserInfo = async (email) => {
        try {
            const response = await axios.get(`http://localhost:3001/user-info/${email}`); //Concensus to use email as the identifier for order and info changes
            setUserInfo(response.data);
            setNewUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    //Getting all transcation data from the database using email as the identifier
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/order-transactions/${email}`); //Email parameter
                const transactionsWithPNames = await Promise.all(response.data.map(async transaction => {
                    const product = await getProduct(transaction.pid);
                    return {
                        ...transaction,
                        productName: product ? product.pname : 'Unknown Product' //If product is not found, display 'Unknown Product'
                    };
                }));
                setTransactions(transactionsWithPNames);
            } catch (error) {
                console.error('Error fetching order transactions:', error);
            }
        };

        if (email) {
            fetchTransactions();
        }
    }, [email]);

    //Using  getProduct function to get the product catalog as "data" from the database
    const getProduct = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:3001/find-product/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    };

    //Updating the order status to '2' (canceled) in the database using transaction id
    const updateOrderStatus = async (transactionId) => {
        try {
            await axios.put(`http://localhost:3001/update-order-status/${transactionId}`, { ostatus: 2 });
            const response = await axios.get(`http://localhost:3001/order-transactions/${email}`);  //futhe filter by email as the identifier
            const transactionsWithProductNames = await Promise.all(response.data.map(async transaction => {
                const product = await getProduct(transaction.pid);
                return {
                    ...transaction,
                    productName: product ? product.pname : 'Unknown Product'
                };
            }));
            setTransactions(transactionsWithProductNames);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    //Grouping transactions by order status
    const groupTransactionsByOrderStatus = (transactions) => {
        const groupedTransactions = {};
        transactions.forEach(transaction => {
            if (!groupedTransactions[transaction.ostatus]) {
                groupedTransactions[transaction.ostatus] = {};
            }
            if (!groupedTransactions[transaction.ostatus][transaction.tid]) {
                groupedTransactions[transaction.ostatus][transaction.tid] = []; 
            }
            groupedTransactions[transaction.ostatus][transaction.tid].push(transaction); //For displaying the transactions in the account page
        });
        return groupedTransactions;
    };

    //Initiating the grouped transactions functions
    const groupedTransactions = groupTransactionsByOrderStatus(transactions);

    //Changing Orderstatus header based on the status (Legend: 0 - Pending, 1 - Completed, 2 - Canceled)
    const getOrderStatusHeader = (status) => {
        switch(status) {
            case '0':
                return 'Pending';
            case '1':
                return 'Completed';
            case '2':
                return 'Canceled';
            default:
                return `Order Status: ${status}`;
        }
    };

    //Functions for editing user info
      //Edit, Cancel, Save, and Change functions
    const handleEdit = () => {
      setEditMode(true);
  };

  const handleCancel = () => {
      setEditMode(false);
      setNewUserInfo(userInfo);
  };

  const handleChange = (e) => {
      const { name, value } = e.target;
      setNewUserInfo({ ...newUserInfo, [name]: value });
  };

  //Updating the user info in the database
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.put(`http://localhost:3001/user-info/update`, newUserInfo);
          setUserInfo(newUserInfo);
          setEditMode(false);
      } catch (error) {
          console.error('Error updating user info:', error);
      }
  };

    return (
      // Account page layout
        <div className="accountpage_container">
            <h1>Account Page</h1>
            <div className="account_nav"> 
              <div className="account_nav_welcome">
                <h2>Welcome!</h2>
                <h2> {email}</h2>
              </div>

              <div className="account_nav_form">
                {/* If edit mode is TRUE input will be editable */}
                {editMode ? (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>First Name:</label>
                            <input className='account_form' type="text" name="fname" value={newUserInfo.fname} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Middle Name:</label>
                            <input className='account_form' type="text" name="mname" value={newUserInfo.mname} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input className='account_form' type="text" name="lname" value={newUserInfo.lname} onChange={handleChange} />
                        </div>
                        <div className='button_form'>
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                ) : ( 
                  // Else input will be disabled
                    <div>
                        <div>
                            <label>First Name:</label>
                            <input className='account_form' type="text" name="fname" value={userInfo.fname} disabled="disabled" />
                        </div>
                        <div>
                            <label>Middle Name:</label>
                            <input className='account_form' type="text" name="mname" value={userInfo.mname} disabled="disabled" />
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input className='account_form' type="text" name="lname" value={userInfo.lname} disabled="disabled"/>
                        </div>
                        <button type="button" onClick={handleEdit}>Edit</button>
                    </div>
                )}
                </div>
              </div>
            <br />
            <br />
            {/* Second half for the transaction */}
            <h2>Order Transactions for {email}</h2>
            {Object.keys(groupedTransactions).map(orderStatus => ( //First, Grouped by order status
                <div key={orderStatus} className="order-status-section"> {/* Then, Categorized by order status */}
                    <h3>{getOrderStatusHeader(orderStatus)}</h3>
                    {Object.keys(groupedTransactions[orderStatus]).map(transactionId => (
                        <div key={transactionId} className="transaction-card">
                            <h4>Transaction ID: {transactionId}</h4>
                            {groupedTransactions[orderStatus][transactionId].map(transaction => (

                              //Displaying the transaction details
                                <div key={transaction._id}>
                                    <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                                    <p>Time: {transaction.time}</p>
                                    {/* <p>Product ID: {transaction.pid}</p> Optional to show */}
                                    <p>Product Name: {transaction.productName}</p>
                                    <p>Quantity: {transaction.oqty}</p>

                                    {/* Displaying "Cancel" button if the order is 0 - Pending */}
                                    {orderStatus === '0' && (
                                        <button onClick={() => updateOrderStatus(transaction._id)}>Cancel Order</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Account;
