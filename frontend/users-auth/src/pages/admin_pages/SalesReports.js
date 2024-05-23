import React, { useState, useEffect } from 'react';

const SalesReports = () => {
    const [orderTransactions, setOrderTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [productSales, setProductSales] = useState([]);
    const [filterType, setFilterType] = useState('annual');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth() + 1); // Months are zero-indexed
    const [totalSalesAmount, setTotalSalesAmount] = useState(0);
    const [totalQuantitySold, setTotalQuantitySold] = useState(0);

    useEffect(() => {
        fetchOrderTransactions();
        fetchProducts();
    }, []);

    useEffect(() => {
        calculateProductSales();
    }, [orderTransactions, products]);

    useEffect(() => {
        if (filterType === 'annual' || filterType === 'monthly') {
            setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1));
        }
    }, [filterType, selectedYear, selectedMonth]);

    useEffect(() => {
        filterSales();
    }, [filterType, selectedDate]);

    const fetchOrderTransactions = async () => {
        try {
            const response = await fetch('http://localhost:3001/orderTransactions');
            if (!response.ok) {
                throw new Error('Failed to fetch order transactions');
            }
            const data = await response.json();
            setOrderTransactions(data);
        } catch (error) {
            console.error('Error fetching order transactions:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const calculateProductSales = () => {
        const completedTransactions = orderTransactions.filter(transaction => transaction.ostatus === 1);
        const productSalesData = {};
        let totalSales = 0;
        let totalQuantity = 0;

        completedTransactions.forEach(transaction => {
            const { pid, oqty } = transaction;

            if (!productSalesData[pid]) {
                productSalesData[pid] = {
                    pname: products.find(product => product.pid === pid)?.pname || 'Unknown Product',
                    quantity: 0,
                    price: products.find(product => product.pid === pid)?.price || 0,
                    pid: pid
                };
            }
            productSalesData[pid].quantity += oqty;
            totalSales += oqty * productSalesData[pid].price;
            totalQuantity += oqty;
        });

        const productSalesArray = Object.values(productSalesData);
        setProductSales(productSalesArray);
        setTotalSalesAmount(totalSales);
        setTotalQuantitySold(totalQuantity);
    };

    const filterSales = () => {
        switch (filterType) {
            case 'annual':
                filterSalesByYear(selectedYear);
                break;
            case 'monthly':
                filterSalesByMonth(selectedYear, selectedMonth);
                break;
            case 'weekly':
                filterSalesByWeek(selectedDate);
                break;
            default:
                break;
        }
    };

    const filterSalesByYear = (year) => {
        const filteredTransactions = orderTransactions.filter(transaction => {
            return new Date(transaction.date).getFullYear() === year && transaction.ostatus === 1;
        });

        updateProductSales(filteredTransactions);
    };

    const filterSalesByMonth = (year, month) => {
        const filteredTransactions = orderTransactions.filter(transaction => {
            return new Date(transaction.date).getFullYear() === year &&
                new Date(transaction.date).getMonth() === month - 1 && transaction.ostatus === 1;
        });

        updateProductSales(filteredTransactions);
    };

    const filterSalesByWeek = (date) => {
        const firstDayOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

        const filteredTransactions = orderTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= firstDayOfWeek && transactionDate <= lastDayOfWeek && transaction.ostatus === 1;
        });

        updateProductSales(filteredTransactions);
    };

    const updateProductSales = (filteredTransactions) => {
        const productSalesData = {};
        let totalSales = 0;
        let totalQuantity = 0;

        filteredTransactions.forEach(transaction => {
            const { pid, oqty } = transaction;

            if (!productSalesData[pid]) {
                productSalesData[pid] = {
                    pname: products.find(product => product.pid === pid)?.pname || 'Unknown Product',
                    quantity: 0,
                    price: products.find(product => product.pid === pid)?.price || 0,
                    pid: pid
                };
            }
            productSalesData[pid].quantity += oqty;
            totalSales += oqty * productSalesData[pid].price;
            totalQuantity += oqty;
        });

        const productSalesArray = Object.values(productSalesData);
        setProductSales(productSalesArray);
        setTotalSalesAmount(totalSales);
        setTotalQuantitySold(totalQuantity);
    };

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
    };

    const handleDateChange = (e) => {
        setSelectedDate(new Date(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    return (
        <div>
            <h1>Sales Reports</h1>

            <div>
                <label>Select Filter Type:</label>
                <select value={filterType} onChange={handleFilterTypeChange}>
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>

            {(filterType === 'annual' || filterType === 'monthly') && (
                <div>
                    <label>Select Year:</label>
                    <input type="number" value={selectedYear} onChange={handleYearChange} />
                </div>
            )}

            {filterType === 'monthly' && (
                <div>
                    <label>Select Month:</label>
                    <input type="number" value={selectedMonth} onChange={handleMonthChange} min="1" max="12" />
                </div>
            )}

            {filterType === 'weekly' && (
                <div>
                    <label>Select Date:</label>
                    <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateChange} />
                </div>
            )}

            <h2>Products Sold</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity Sold</th>
                        <th>Price</th>
                        <th>Total Sales Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {productSales.map(product => (
                        <tr key={product.pid}>
                            <td>{product.pname}</td>
                            <td>{product.quantity}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>${(product.quantity * product.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3">Total:</td>
                        <td>${totalSalesAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3">Total Quantity Sold:</td>
                        <td>{totalQuantitySold}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default SalesReports;

