import React, { useState, useEffect } from "react";

const SalesReports = () => {
  const [orderTransactions, setOrderTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [filterType, setFilterType] = useState("annual");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    selectedDate.getMonth() + 1
  ); // Months are zero-indexed
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalQuantitySold, setTotalQuantitySold] = useState(0);

  useEffect(() => {
    fetchOrderTransactions();
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateInitialProductSales();
  }, [orderTransactions, products]);

  useEffect(() => {
    filterSales();
  }, [filterType, selectedYear, selectedMonth, selectedDate]);

  const fetchOrderTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3001/orderTransactions");
      if (!response.ok) {
        throw new Error("Failed to fetch order transactions");
      }
      const data = await response.json();
      setOrderTransactions(data);
    } catch (error) {
      console.error("Error fetching order transactions:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const calculateInitialProductSales = () => {
    const currentYearTransactions = orderTransactions.filter((transaction) => {
      return (
        new Date(transaction.date).getFullYear() === selectedYear &&
        transaction.ostatus === 1
      );
    });

    updateProductSales(currentYearTransactions);
  };

  const filterSales = () => {
    switch (filterType) {
      case "annual":
        filterSalesByYear(selectedYear);
        break;
      case "monthly":
        filterSalesByMonth(selectedYear, selectedMonth);
        break;
      case "weekly":
        filterSalesByWeek(selectedDate);
        break;
      default:
        break;
    }
  };

  const filterSalesByYear = (year) => {
    const filteredTransactions = orderTransactions.filter((transaction) => {
      return (
        new Date(transaction.date).getFullYear() === year &&
        transaction.ostatus === 1
      );
    });

    updateProductSales(filteredTransactions);
  };

  const filterSalesByMonth = (year, month) => {
    const filteredTransactions = orderTransactions.filter((transaction) => {
      return (
        new Date(transaction.date).getFullYear() === year &&
        new Date(transaction.date).getMonth() === month - 1 &&
        transaction.ostatus === 1
      );
    });

    updateProductSales(filteredTransactions);
  };

  const filterSalesByWeek = (date) => {
    const firstDayOfWeek = new Date(
      date.setDate(date.getDate() - date.getDay())
    );
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    const filteredTransactions = orderTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate >= firstDayOfWeek &&
        transactionDate <= lastDayOfWeek &&
        transaction.ostatus === 1
      );
    });

    updateProductSales(filteredTransactions);
  };

  const updateProductSales = (filteredTransactions) => {
    const productSalesData = {};
    let totalSales = 0;
    let totalQuantity = 0;

    filteredTransactions.forEach((transaction) => {
      const { pid, oqty } = transaction;

      if (!productSalesData[pid]) {
        productSalesData[pid] = {
          pname:
            products.find((product) => product.pid === pid)?.pname ||
            "Unknown Product",
          quantity: 0,
          price: products.find((product) => product.pid === pid)?.price || 0,
          pid: pid,
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
    <div id="salesReports">
      <div className="pageHeader">
        <h1 className="title">Sales Reports</h1>
        <span className="pageDescription">
          The table below displays the list of products sold, sales income
          generated by each product, and the total amount of sales and products
          sold.
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity Sold</th>
            <th>Price</th>
            <th>Total Sales Amount</th>
            <th>
              <div className="sort">
                <div className="sortContainer">
                  <div>
                    <label>Type: </label>
                    <select
                      className="sortSelect"
                      value={filterType}
                      onChange={handleFilterTypeChange}
                    >
                      <option value="annual">Annual</option>
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  {(filterType === "annual" || filterType === "monthly") && (
                    <div>
                      <label>Year: </label>
                      <input
                        className="sortInput"
                        type="number"
                        value={selectedYear}
                        onChange={handleYearChange}
                      />
                    </div>
                  )}

                  {filterType === "monthly" && (
                    <div>
                      <label>Month: </label>
                      <input
                        className="sortInput"
                        type="number"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        min="1"
                        max="12"
                      />
                    </div>
                  )}

                  {filterType === "weekly" && (
                    <div>
                      <label>Date: </label>
                      <input
                        className="sortInput"
                        type="date"
                        value={selectedDate.toISOString().split("T")[0]}
                        onChange={handleDateChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {productSales.map((product) => (
            <tr key={product.pid}>
              <td>{product.pname}</td>
              <td>{product.quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>${(product.quantity * product.price).toFixed(2)}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr id="total">
            <td colSpan="3">Total:</td>
            <td>${totalSalesAmount.toFixed(2)}</td>
            <td></td>
          </tr>
          <tr id="totalQtySold">
            <td colSpan="3">Total Quantity Sold:</td>
            <td>{totalQuantitySold}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SalesReports;
