import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });



  useEffect(() => {

    const getproduct = async () => {
      const data = await fetch('https://ecom-testing-q8ge.onrender.com/api/getallproduct');
      const res = await data.json();
      console.log("this is data", res)
    }

    getproduct()
  }, [])



  // Fetch categories
  useEffect(() => {
    axios.get("https://ecom-testing-q8ge.onrender.com/api/getallcategory").then((res) => {
      setCategories(
        res.data.allcategory.map((cat) => ({ value: cat._id, label: cat.name }))
      );
    });
  }, []);

  // Fetch products

  useEffect(() => {
    const url = selectedCategory
      ? `https://ecom-testing-q8ge.onrender.com/api/getallproduct?category=${selectedCategory.value}`
      : "https://ecom-testing-q8ge.onrender.com/api/getallproduct";

    console.log(selectedCategory)

    const fetchProducts = async () => {
      try {
        const response = await fetch(url);
        const res = await response.json();
        console.log("this is dekho", res.data);
        if (res.data) {
          setProducts(res.data);
        }
        else{
          setProducts([]);
        }

      } catch (err) {
        console.log("Error fetching products:", err);
      }
    };

    fetchProducts(); // ✅ Function call kiya

  }, [selectedCategory]);


  const handleCreateCategory = () => {
    if (!newCategory) return alert("Enter a category name");
    axios
      .post("https://ecom-testing-q8ge.onrender.com/api/createcategory", { name: newCategory })
      .then(() => {
        alert("Category added!");
        setNewCategory("");
        window.location.reload();
      });
  };


  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category)
      return alert("Fill all fields!");

    axios
      .post("https://ecom-testing-q8ge.onrender.com/api/createproduct", {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        productid: newProduct.category,
      })
      .then(() => {
        alert("Product added!");
        setNewProduct({ name: "", description: "", price: "", category: "" });
        window.location.reload();
      });
  };

  return (
    <div className="container">
      {/* Navbar */}
      <div className="navbar">
        <h1>Product Management</h1>
        <div>
          <p>Login</p>
          <p>Signup</p>
        </div>
      </div>

      {/* Category Selection */}
      <h2>Select Category</h2>
      <Select options={categories} onChange={setSelectedCategory} />

      {/* Product Display */}
      <h2>Products</h2>
      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
            </div>
          ))
        )}
      </div>

      {/* Create Category */}
      <div className="form">
        <h2>Create Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleCreateCategory}>Add Category</button>
      </div>

      {/* Create Product */}
      <div className="form">
        <h2>Create Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <Select
          options={categories}
          onChange={(option) =>
            setNewProduct({ ...newProduct, category: option.value })
          }
        />
        <button onClick={handleCreateProduct}>Add Product</button>
      </div>
    </div>
  );
}

export default App;
