'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Upload from '../components/Upload';
import Upload1 from '../components/Upload1'; // For videos

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [points, setPts] = useState('');
  const [discount, setDiscount] = useState('');
  const [img, setImg] = useState(['']);
  const [video, setVideo] = useState(['']);
  const [delivery, setDelivery] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isOut, setIsOut] = useState(false);
  const [sizeList, setSizeList] = useState([{ size: '', price: '' }]);
  const [nameList, setNameList] = useState(['']);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showPrice, setShowPrice] = useState('with');
  const [optionType, setOptionType] = useState("size");


  useEffect(() => {
    fetch('/api/brand')
      .then((res) => res.json())
      .then(setBrands)
      .catch(console.error);
  }, []);


  useEffect(() => {
    fetch('/api/category')
      .then((res) => res.json())
      .then(setCategoryOptions)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch('/api/sub')
      .then((res) => res.json())
      .then(setAllSubCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const filtered = allSubCategories?.filter(
      (sub) => sub.category === selectedCategory
    );
    setFilteredSubCategories(filtered);
    setSelectedSubCategory('');
  }, [selectedCategory, allSubCategories]);



  const handleImgChange = (url) => {
    if (url) setImg(url);
  };

  const handleVideoChange = (url) => {
    if (url) setVideo(url);
  };

  const handleAddSize = () => {
    setSizeList([...sizeList, { size: '', price: '' }]);
  };


  const handleAddName = () => {
    setNameList([...nameList, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (img.length === 1 && img[0] === '') {
      alert('Please choose at least 1 image');
      return;
    }

    const payload = {
      title,
      description,
      price,
      points,
      discount,
      img,
      video,
      delivery: delivery + "",
      category: selectedCategory,
      subcategory: selectedSubCategory,
      brand: selectedBrand,
      sizes: sizeList,
      names: nameList, 
      ...(isNewArrival && { arrival: 'yes' }), 
      ...(isOut && { isOut: 'yes' }), 
    };

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Product added successfully!');
      window.location.href = '/dashboard';
    } else {
      alert('Failed to add product');
    }
  };
 
  
  

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />



      {/* Category */}
      <label className="block font-bold">Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="" disabled>Select a category</option>
        {categoryOptions.map((cat) => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      {/* Subcategory */}
      {filteredSubCategories.length > 0 && (
        <>
          <label className="block font-bold">Subcategory</label>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full border p-2 mb-4"
          >
            <option value="" disabled>Select a subcategory</option>
            {filteredSubCategories.map((sub) => (
              <option key={sub.id} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        </>
      )}


      <label className="block font-bold">Brand</label>
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        className="w-full border p-2 mb-4"

      >
        <option value="" disabled>Select a brand</option>
        {brands.map((b, i) => (
          <option key={i} value={b.name}>{b.name}</option>
        ))}
      </select>


      <div>
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              name="priceToggle"
              value="with"
              checked={showPrice === 'with'}
              onChange={() => setShowPrice('with')}
              className="mr-1"
            />
            With Discount
          </label>
          <label>
            <input
              type="radio"
              name="priceToggle"
              value="without"
              checked={showPrice === 'without'}
              onChange={() => setShowPrice('without')}
              className="mr-1"
            />
            Without Discount
          </label>
        </div>

        {showPrice === 'with' && (
          <input
            type="number"
            step="0.01"
            placeholder="Price Before"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 mb-4"
          />
        )}
      </div>

      <input
        type="number"
        step="0.01"
        placeholder="Final Price"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <input
        type="number"
        placeholder="Delivery price"
        value={delivery}
        onChange={(e) => setDelivery(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <input
        type="number"
        placeholder="Points"
        value={points}
        onChange={(e) => setPts(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />




<div>
    {/* Radio Button Toggle */}
    <div className="mb-4">
      <label className="font-bold block mb-2">Select Option Type</label>
      <label className="mr-4">
        <input
          type="radio"
          name="optionType"
          value="size"
          checked={optionType === "size"}
          onChange={() => setOptionType("size")}
          className="mr-1"
        />
        Size
      </label>
      <label>
        <input
          type="radio"
          name="optionType"
          value="name"
          checked={optionType === "name"}
          onChange={() => setOptionType("name")}
          className="mr-1"
        />
        Name
      </label>
    </div>

    {/* Sizes & Prices (shown only if 'size' is selected) */}
    {optionType === "size" && (
      <div className="mb-4">
        <label className="font-bold block">Sizes & Prices</label>
        {sizeList.map((entry, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`Size ${idx + 1}`}
              value={entry.size}
              onChange={(e) => {
                const updated = [...sizeList];
                updated[idx].size = e.target.value;
                setSizeList(updated);
              }}
              className="w-1/2 border p-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={entry.price}
              onChange={(e) => {
                const updated = [...sizeList];
                updated[idx].price = e.target.value;
                setSizeList(updated);
              }}
              className="w-1/2 border p-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSize}
          className="text-blue-500"
        >
          + Add Size
        </button>
      </div>
    )}

    {/* Names (shown only if 'name' is selected) */}
    {optionType === "name" && (
      <div className="mb-4">
        <label className="font-bold block">Names</label>
        {nameList.map((name, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Name ${idx + 1}`}
            value={name}
            onChange={(e) => {
              const updated = [...nameList];
              updated[idx] = e.target.value;
              setNameList(updated);
            }}
            className="w-full border p-2 mb-2"
          />
        ))}
        <button
          type="button"
          onClick={handleAddName}
          className="text-blue-500"
        >
          + Add Name
        </button>
      </div>
    )}
  </div> 

      <label className="block text-lg font-bold mb-2">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write your product description here..."
      />

      <Upload onImagesUpload={handleImgChange} />

      <Upload1 onFilesUpload={handleVideoChange} />

      <div className="flex items-center my-4">
        <input
          type="checkbox"
          id="newArrival"
          checked={isNewArrival}
          onChange={(e) => setIsNewArrival(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="newArrival" className="text-lg font-bold">Best Seller</label>
      </div>

      <div className="flex items-center my-4">
        <input
          type="checkbox"
          id="isOut"
          checked={isOut}
          onChange={(e) => setIsOut(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isOut" className="text-lg font-bold">Out of Stock</label>
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Save Product
      </button>
    </form>
  );
}
