import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import "../pages_css/AdminAccount.css";

function ProductListings() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("name");
  const [sortOrder, setSortOrder] = useState("ascending");

  const [pname, setProdName] = useState("");
  const [pdesc, setProdDesc] = useState("");
  const [prodType, setProdType] = useState("");
  const [pqty, setProdQty] = useState("");
  const [price, setProdPrice] = useState("");

  const [newQtyMap, setNewQtyMap] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await fetch("http://localhost:3001/products").then(
        (response) => response.json()
      );
      setProducts(products);
      sortProducts(products, sortOption, sortOrder);
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  useEffect(() => {
    sortProducts(products, sortOption, sortOrder);
  }, [sortOption, sortOrder]);

  function changeSortOption(event) {
    setSortOption(event.target.value);
  }

  function changeSortOrder(event) {
    setSortOrder(event.target.value);
  }

  function sortProducts(prodList, option, order) {
    let sortedProducts = [];
    if (option === "name") {
      sortedProducts = [...prodList].sort((a, b) =>
        a.pname.localeCompare(b.pname)
      );
    } else if (option === "price") {
      sortedProducts = [...prodList].sort((a, b) => a.price - b.price);
    } else if (option === "type") {
      sortedProducts = [...prodList].sort((a, b) => a.ptype - b.ptype);
    } else if (option === "quantity") {
      sortedProducts = [...prodList].sort((a, b) => a.pqty - b.pqty);
    }

    if (order === "descending") {
      sortedProducts.reverse();
    }
    setProducts(sortedProducts);
  }

  const confirmDelete = (productName, productId) => {
    const confirmed = window.confirm(
      `Are you sure you would like to delete ${productName}?`
    );

    if (confirmed) {
      deleteProduct(productId);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch("http://localhost:3001/delete-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pid: productId }),
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const addProduct = () => {
    var modal = document.getElementById("addProductModal");
    modal.style.display = "block";

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  };

  const addNewProduct = async () => {
    var ptype;
    switch (prodType) {
      case "Staple":
        ptype = 1;
        break;
      case "Fruits and Vegetables":
        ptype = 2;
        break;
      case "Livestock":
        ptype = 3;
        break;
      case "Seafood":
        ptype = 4;
        break;
      case "Others":
        ptype = 5;
        break;
      default:
        ptype = 0;
        break;
    }

    if (
      pname !== "" &&
      pdesc !== "" &&
      prodType !== "" &&
      pqty !== "" &&
      price !== ""
    ) {
      try {
        const response = await fetch("http://localhost:3001/save-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pid: nanoid(),
            pname: pname,
            pdesc: pdesc,
            ptype: ptype,
            pqty: pqty,
            price: price,
          }),
        });

        if (response.ok) {
          var modal = document.getElementById("addProductModal");
          modal.style.display = "none";
          fetchProducts();
        }
      } catch (err) {
        console.error("Error adding product:", err);
      }
    } else {
      alert("Please fill out all the boxes.");
      return;
    }
  };

  function showEditQty(pid, pqty) {
    const qtyText = document.getElementById(`${pid}prodQty`);
    qtyText.style.display = "none";

    // Create a copy of newQtyMap
    const updatedNewQtyMap = { ...newQtyMap };

    // Set newQty for the selected product
    updatedNewQtyMap[pid] = pqty;

    // Update state with the newQtyMap
    setNewQtyMap(updatedNewQtyMap);

    const qtyInput = document.getElementById(`${pid}editQtyInput`);
    qtyInput.style.display = "block";
    const saveButton = document.getElementById(`${pid}saveEditQty`);
    saveButton.style.display = "block";
  }

  const saveNewQty = async (productId, prevQty) => {
    const qtyText = document.getElementById(`${productId}prodQty`);
    qtyText.style.display = "block";

    // Only update if newQty is not blank or is not equal to previous quantity
    if (newQtyMap[productId] !== "" && newQtyMap[productId] !== prevQty) {
      try {
        const result = await fetch("http://localhost:3001/update-productqty", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pid: productId, pqty: newQtyMap[productId] }),
        });

        if (result.ok) {
          // Fetch products again to display updated values
          fetchProducts();
        }
      } catch (e) {
        console.log("Error saving product quantity:", e);
      }
    }

    const qtyInput = document.getElementById(`${productId}editQtyInput`);
    qtyInput.style.display = "none";
    const saveButton = document.getElementById(`${productId}saveEditQty`);
    saveButton.style.display = "none";
  };

  function inputNewQty(event, productId) {
    // Create a copy of newQtyMap
    const updatedNewQtyMap = { ...newQtyMap };

    // Update newQty for the selected product
    updatedNewQtyMap[productId] = event.target.value;

    // Update state with the newQtyMap
    setNewQtyMap(updatedNewQtyMap);
  }

  function setName(event) {
    setProdName(event.target.value);
  }

  function setDesc(event) {
    setProdDesc(event.target.value);
  }

  function setNewProductType(event) {
    setProdType(event.target.value);
  }

  function setQty(event) {
    setProdQty(event.target.value);
  }

  function setPrice(event) {
    setProdPrice(event.target.value);
  }

  const getTypeName = (type) => {
    switch (type) {
      case 1:
        return "Staple";
      case 2:
        return "Fruits and Vegetables";
      case 3:
        return "Livestock";
      case 4:
        return "Seafood";
      case 5:
        return "Others";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="productListings">
      <div className="pageHeader">
        <h1 className="title">Product Listings</h1>
        <span className="pageDescription">
          The table below reflects the products currently available for
          customers on the Farm To Table shop.{" "}
        </span>
        <span id="highlightDescription">
          Click on a product's stock quantity to edit.
        </span>
      </div>
      <div className="products">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Stock</th>
              <th>Price</th>
              <th>
                <div className="sort">
                  <div className="sortContainer">
                    <label>Sort by: </label>
                    <select
                      className="sortSelect"
                      value={sortOption}
                      onChange={changeSortOption}
                    >
                      <option value={"name"}>Name</option>
                      <option value={"price"}>Price</option>
                      <option value={"type"}>Type</option>
                      <option value={"quantity"}>Quantity</option>
                    </select>
                  </div>
                  <div className="sortContainer">
                    <label>Order: </label>
                    <select
                      className="sortSelect"
                      value={sortOrder}
                      onChange={changeSortOrder}
                    >
                      <option value={"ascending"}>Ascending</option>
                      <option value={"descending"}>Descending</option>
                    </select>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.pid}>
                <td className="name">{product.pname}</td>
                <td className="desc">{product.pdesc}</td>
                <td className="type">{getTypeName(product.ptype)}</td>
                <td className="qty">
                  <span
                    id={`${product.pid}prodQty`}
                    className="prodQty"
                    onClick={() => {
                      showEditQty(product.pid, product.pqty);
                    }}
                  >
                    {product.pqty}
                  </span>
                  <div id="editQty">
                    <input
                      type="number"
                      value={newQtyMap[product.pid] || ""}
                      id={`${product.pid}editQtyInput`}
                      className="editQtyInput"
                      onChange={(event) => inputNewQty(event, product.pid)}
                    />
                    <button
                      id={`${product.pid}saveEditQty`}
                      className="saveEditQty"
                      onClick={() => {
                        saveNewQty(product.pid, product.pqty);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td className="price">{product.price.toFixed(2)}</td>
                <td>
                  <button
                    id="deleteProductButton"
                    onClick={() => {
                      confirmDelete(product.pname, product.pid);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addProduct} id="addProductButton">
          Add New Product
        </button>
      </div>

      <div id="addProductModal">
        <div id="addProductContent">
          <h1>New Product</h1>
          <form id="form" action="submit" method="GET">
            <br />
            <br />
            <label htmlFor="name">Product name </label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              value={pname}
              onChange={setName}
              required
            />
            <br />
            <br />
            <label htmlFor="desc">Product description </label>
            <br />
            <input
              type="text"
              id="desc"
              name="desc"
              value={pdesc}
              onChange={setDesc}
              required
            />
            <br />
            <br />
            <label>Product type </label>
            <br />
            <select
              id="ptypeSelect"
              value={prodType}
              onChange={setNewProductType}
            >
              <option value={""}></option>
              <option value={"Staple"}>Staple</option>
              <option value={"Fruits and Vegetables"}>
                Fruits and Vegetables
              </option>
              <option value={"Livestock"}>Livestock</option>
              <option value={"Seafood"}>Seafood</option>
              <option value={"Others"}>Other</option>
            </select>
            <br />
            <br />
            <label htmlFor="qty">Product quantity </label>
            <br />
            <input
              type="number"
              id="qty"
              name="qty"
              value={pqty}
              onChange={setQty}
              required
            />
            <br />
            <br />
            <label htmlFor="price">Product price </label>
            <br />
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={setPrice}
              required
            />
          </form>
          <br />
          <br />
          <button type="submit" id="addButton" onClick={addNewProduct}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductListings;
