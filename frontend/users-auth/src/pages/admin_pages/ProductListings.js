import React, { useEffect, useState } from "react";
import { nanoid } from 'nanoid'
import '../pages_css/AdminAccount.css'

function ProductListings(){
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState("name");
    const [sortOrder, setSortOrder] = useState("ascending");

    const [pname, setProdName] = useState("");
    const [pdesc, setProdDesc] = useState("");
    const [prodType, setProdType] = useState("");
    const [pqty, setProdQty] = useState("");
    const [price, setProdPrice] = useState("");

    useEffect(() => {
        fetchProducts();
    },[]);

    const fetchProducts = async () => {
        try{
            const products = await fetch('http://localhost:3001/products').then(response => response.json());
            setProducts(products);
        } catch (e) {
            console.error('Error fetching products:', e)
        }
    }
    
    useEffect(() => {
        sortProducts(products, sortOption, sortOrder);
    },[sortOption, sortOrder]);


    function changeSortOption (event) {
        setSortOption(event.target.value);
    }

    function changeSortOrder(event) {
        setSortOrder(event.target.value);
    }

    function sortProducts (prodList, option, order) {
        let sortedProducts = [];
    if (option === 'name') {
      sortedProducts = [...prodList].sort((a, b) => a.pname.localeCompare(b.pname));
    } else if (option === 'price') {
      sortedProducts = [...prodList].sort((a, b) => a.price - b.price);
    } else if (option === 'type') {
      sortedProducts = [...prodList].sort((a, b) => a.ptype - b.ptype);
    } else if (option === 'quantity') {
      sortedProducts = [...prodList].sort((a, b) => a.pqty - b.pqty);
    }

    if (order === 'descending') {
      sortedProducts.reverse();
    }
    setProducts(sortedProducts);
    }

    const confirmDelete = (productName, productId)=> {
        const confirmed = window.confirm(`Are you sure you would like to delete ${productName}?`);

        if(confirmed){
            deleteProduct(productId);
        }        
    }

    const deleteProduct = async (productId) => {
        try{
            const response = await fetch('http://localhost:3001/delete-product',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({pid: productId})
            });

            if(response.ok) {
                fetchProducts();
            }
        } catch (err) {
            console.error('Error deleting product:', err);
        }
        
    }

    const addProduct = () => {
        var modal = document.getElementById("addProductModal");
        modal.style.display = "block";
        
        window.onclick = (event) => {
            if(event.target===modal){
                modal.style.display = "none";
            }
        }
    }

    const addNewProduct = async () => {
        var ptype;
        switch (prodType){
            case 'Staple':
                ptype = 1;
                break;
            case 'Fruits and Vegetables':
                ptype = 2;
                break;
            case 'Livestock':
                ptype = 3;
                break;
            case 'Seafood':
                ptype = 4;
                break;
            case 'Others':
                ptype = 5;
                break;
            default:
                ptype = 0;
                break;
        }

        if(pname!=="" && pdesc!=="" && prodType!=="" && pqty!=="" && price!==""){
            try{
                const response = await fetch('http://localhost:3001/save-product',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({pid: nanoid(), pname: pname, pdesc: pdesc, ptype: ptype, pqty:pqty, price: price})
                });

                if(response.ok) {
                    var modal = document.getElementById("addProductModal");
                    modal.style.display = "none";
                    fetchProducts();
                }
            } catch (err) {
                console.error('Error adding product:', err);
            }
        } else {
            alert("Please fill out all the boxes.")
            return;
        }
    }
    
    function setName (event) {
        setProdName(event.target.value)
    }

    function setDesc (event) {
        setProdDesc(event.target.value);
    }

    function setNewProductType (event) {
        setProdType(event.target.value)
    }

    function setQty (event) {
        setProdQty(event.target.value);
    }

    function setPrice (event) {
        setProdPrice(event.target.value);
    }

    const getTypeName = (type) => {
        switch (type){
            case 1:
                return 'Staple';
            case 2:
                return 'Fruits and Vegetables';
            case 3:
                return 'Livestock';
            case 4:
                return 'Seafood';
            case 5:
                return 'Others';
            default:
                return 'Unknown';
        }
    }

    return(
        <div className="productListings">  
            <h1 className="title">Product Listings</h1>
            <div className="sort">
                <label>Sort by: </label>
                <select value={sortOption} onChange={changeSortOption}>
                    <option value={"name"}>Name</option>
                    <option value={"price"}>Price</option>
                    <option value={"type"}>Type</option>
                    <option value={"quantity"}>Quantity</option>
                </select>
                <label>Order:</label>
                <select value={sortOrder} onChange={changeSortOrder}>
                    <option value={"ascending"}>Ascending</option>
                    <option value={"descending"}>Descending</option>
                </select>
            </div>
            <div className="products">
                <table className="productTable">
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                    {products.map(product => (
                        <tr key={product.pid}>
                            <td className="name">{product.pname}</td>
                            <td className="desc">{product.pdesc}</td>
                            <td className="type">{getTypeName(product.ptype)}</td>
                            <td className="qty">{product.pqty}</td>
                            <td className="price">{product.price}</td>
                            <td><button id="deleteProductButton" onClick={()=>{confirmDelete(product.pname, product.pid)}}>Delete</button></td>
                        </tr>
                    ))}
                    <tr id="addProduct"><button onClick={addProduct} id="addProductButton">Add Product</button></tr>
                </table>
            </div>

            <div id="addProductModal">
                <div id="addProductContent">
                    <form id="form" action="submit" method="GET">
                        ADD A PRODUCT
                        <br/>
                        <br/>
                        <label for="name">Product name </label>
                        <input type="text" id="name" name="name" value={pname} onChange={setName} required />
                        <br/>
                        <br/>
                        <label for="desc">Product description </label>
                        <input type="text" id="desc" name="desc" value={pdesc} onChange={setDesc} required />
                        <br/>
                        <br/>
                        <label>Product type </label>
                        <select value={prodType} onChange={setNewProductType}>
                            <option value={""}></option>
                            <option value={"Staple"}>Staple</option>
                            <option value={"Fruits and Vegetables"}>Fruits and Vegetables</option>
                            <option value={"Livestock"}>Livestock</option>
                            <option value={"Seafood"}>Seafood</option>
                            <option value={"Others"}>Other</option>
                        </select>
                        <br/>
                        <br/>
                        <label for="qty">Product quantity </label>
                        <input type="number" id="qty" name="qty" value={pqty} onChange={setQty} required />
                        <br/>
                        <br/>
                        <label for="price">Product price </label>
                        <input type="number" id="price" name="price" value={price} onChange={setPrice} required />         
                    </form>
                    <br/>
                    <br/>
                    <button type="submit" id="addButton" onClick={addNewProduct}>Add</button>
                </div>
            </div>
        </div>
        
    )
}

export default ProductListings