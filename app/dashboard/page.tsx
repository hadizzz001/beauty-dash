'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import Upload1 from '../components/Upload1';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/category');
    const data = await res.json();
    setCategories(data);
  };

  const fetchSubcategories = async () => {
    const res = await fetch('/api/sub');
    const data = await res.json();
    setSubcategories(data);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  const handleEdit = (product) => setEditingProduct(product);

  const handleUpdate = async (updatedProduct) => {
    const res = await fetch(`/api/products/${updatedProduct.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });
    if (res.ok) {
      alert('Updated!');
      setEditingProduct(null);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedCategory || product.category === selectedCategory)
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={handleUpdate}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      <input
        className="w-full p-2 border mb-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title"
      />

      <select
        className="w-full p-2 border mb-4"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Filter by category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            {/* <th className="border p-2">Image</th> */}
            <th className="border p-2">Price</th>
            <th className="border p-2">Discount</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Subcategory</th>
            <th className="border p-2">Best Seller</th>
            <th className="border p-2">Out of Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id} className={p.stock === "0" ? "bg-red-200" : ""}>
              <td className="border p-2">{p.title}</td>
              {/* <td className="border p-2">
                {/\.(mp4|webm)/i.test(p.img[0]) ? (
                  <video src={p.img[0]} className="w-24" controls />
                ) : (
                  <img src={p.img[0]} className="w-24" />
                )}
              </td> */}
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">{p.discount}</td>
              <td className="border p-2">{p.category}</td>
              <td className="border p-2">{p.subcategory}</td>
              <td className="border p-2">{p.arrival}</td>
              <td className="border p-2">{p.isOut}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(p)} className="px-2 py-1 bg-yellow-500 text-white mr-2">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="px-2 py-1 bg-red-500 text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}





function EditProductForm({ product, onCancel, onSave }) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [points, setPts] = useState(product.points);
  const [discount, setDiscount] = useState(product.discount || '');
  const [description, setDescription] = useState(product.description);
  const [img, setImg] = useState(product.img);
  const [video, setVideo] = useState(product.video || []);
  const [delivery, setDelivery] = useState(product.delivery || '');
  const [category, setCategory] = useState(product.category || '');
  const [subcategory, setSubcategory] = useState(product.subcategory || '');
  const [arrival, setArrival] = useState(product.arrival === 'yes');
  const [isOut, setIsOut] = useState(product.isOut === 'yes');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [sizes, setSizes] = useState(product.sizes || []);
  const [names, setNames] = useState(product.names || []);
  const [brand, setBrand] = useState(product.brand || '');
  const [brands, setBrands] = useState([]);


  useEffect(() => {
    const fetchAll = async () => {
      const [cat, sub, col, br] = await Promise.all([
        fetch('/api/category').then(res => res.json()),
        fetch('/api/sub').then(res => res.json()),
        fetch('/api/color').then(res => res.json()),
        fetch('/api/brand').then(res => res.json())
      ]);
      setCategories(cat);
      setSubcategories(sub);
      setBrands(br);
    };
    fetchAll();
  }, []);

  const handleCategoryChange = (val) => {
    setCategory(val);
  };



  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size: '', price: '' }]);
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
  };


  const handleAddName = () => setNames([...names, '']);
  const handleNameChange = (val, idx) => {
    const newNames = [...names];
    newNames[idx] = val;
    setNames(newNames);
  };
  const handleRemoveName = (idx) => {
    const newNames = [...names];
    newNames.splice(idx, 1);
    setNames(newNames);
  };

  const filteredSub = subcategories.filter(s => s.category === category);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...product,
      title,
      price,
      points,
      discount,
      img,
      video,
      delivery,
      description,
      category,
      subcategory,
      arrival: arrival ? 'yes' : 'no',
      isOut: isOut ? 'yes' : 'no',
      sizes,
      names,
      brand,
    };
    onSave(payload);
  };

  const hasSizes = sizes.some(s => s.size || s.price);
const hasNames = names.some(n => n.trim() !== '');

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 mb-6 rounded">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>


      <input className="w-full p-2 border mb-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />

      <select className="w-full p-2 border mb-2" value={category} onChange={(e) => handleCategoryChange(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
      </select>

      {category && filteredSub.length > 0 && (
        <select
          className="w-full p-2 border mb-2"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          required
        >
          <option value="">Select Subcategory</option>
          {filteredSub.map((sub) => (
            <option key={sub.id} value={sub.name}>
              {sub.name}
            </option>
          ))}
        </select>
      )}


      <select
        className="w-full p-2 border mb-2"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}

      >
        <option value="">Select Brand</option>
        {brands.map((b) => (
          <option key={b.id} value={b.name}>
            {b.name}
          </option>
        ))}
      </select>



      <input className="w-full p-2 border mb-2" type="number" value={points} onChange={(e) => setPts(e.target.value)} placeholder="Points" />
      <input className="w-full p-2 border mb-2" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price before" />
      <input className="w-full p-2 border mb-2" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Final Price" />



      <ReactQuill value={description} onChange={setDescription} className="mb-4" theme="snow" />

      <div className="mb-4">
        <label><input type="checkbox" checked={arrival} onChange={(e) => setArrival(e.target.checked)} /> Best Seller</label>
      </div>
      <div className="mb-4">
        <label><input type="checkbox" checked={isOut} onChange={(e) => setIsOut(e.target.checked)} /> Out of Stock</label>
      </div>

      <Upload onImagesUpload={(url) => setImg(url)} />
      <Upload1 onFilesUpload={(url) => setVideo(url)} />

      <input className="w-full p-2 border my-4" value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="Delivery Info" />


{/* Show Sizes only if names are empty */}
{!hasNames && (
  <>
    <h3 className="font-bold mb-1">Sizes</h3>
    {sizes.map((s, i) => (
      <div key={i} className="flex gap-2 mb-2">
        <input
          value={s.size}
          onChange={(e) => handleSizeChange(i, 'size', e.target.value)}
          placeholder="Size"
          className="border p-2 flex-1"
        />
        <input
          type="number"
          value={s.price}
          onChange={(e) => handleSizeChange(i, 'price', e.target.value)}
          placeholder="Price"
          className="border p-2 flex-1"
        />
        <button
          type="button"
          onClick={() => handleRemoveSize(i)}
          className="text-red-500 font-bold"
        >
          ×
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={handleAddSize}
      className="bg-blue-500 text-white px-2 py-1 mb-4"
    >
      Add Size
    </button>
  </>
)}

{/* Show Names only if sizes are empty */}
{!hasSizes && (
  <>
    <h3 className="font-bold mb-1">Names</h3>
    {names.map((s, i) => (
      <div key={i} className="flex gap-2 mb-2">
        <input
          value={s}
          onChange={(e) => handleNameChange(e.target.value, i)}
          className="border p-2 flex-1"
        />
        <button
          type="button"
          onClick={() => handleRemoveName(i)}
          className="text-red-500 font-bold"
        >
          ×
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={handleAddName}
      className="bg-blue-500 text-white px-2 py-1 mb-4"
    >
      Add Name
    </button>
  </>
)}





      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-600 text-white px-4 py-2">Cancel</button>
      </div>
    </form>
  );
}
