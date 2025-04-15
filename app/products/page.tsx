'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Upload from '../components/Upload';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('');
  const [img, setImg] = useState(['']);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [productType, setProductType] = useState('single');
  const [colorQtyList, setColorQtyList] = useState([{ code: '', qty: '', img: [] }]);
  const [sizeList, setSizeList] = useState(['']);
  const [allColors, setAllColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);

  // Fetch categories
  useEffect(() => {
    fetch('/api/category')
      .then((res) => res.json())
      .then(setCategoryOptions)
      .catch(console.error);
  }, []);


  useEffect(() => {
console.log("colorQtyList", colorQtyList);

  }, [colorQtyList]);

  // Fetch subcategories
  useEffect(() => {
    fetch('/api/sub')
      .then((res) => res.json())
      .then(setAllSubCategories)
      .catch(console.error);
  }, []);

  // Filter subcategories
  useEffect(() => {
    const filtered = allSubCategories.filter(
      (sub) => sub.category === selectedCategory
    );
    setFilteredSubCategories(filtered);
    setSelectedSubCategory('');
  }, [selectedCategory, allSubCategories]);

  // Fetch all colors
  useEffect(() => {
    fetch('/api/color')
      .then((res) => res.json())
      .then(setAllColors)
      .catch(console.error);
  }, []);

  // Filter colors by category
  useEffect(() => {
    const filtered = allColors.filter(
      (color) => color.category === selectedCategory
    );
    setFilteredColors(filtered);
  }, [selectedCategory, allColors]);

  const handleImgChange = (url) => {
    if (url) setImg(url);
  };

  const handleAddColorQty = () => {
    setColorQtyList([...colorQtyList, { code: '', qty: '', img: [] }]);
  };

  const handleAddSize = () => {
    setSizeList([...sizeList, '']);
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
      discount,
      img,
      category: selectedCategory,
      subcategory: selectedSubCategory,
      type: productType,
      sizes: sizeList,
      ...(productType === 'single'
        ? { stock }
        : { colors: colorQtyList }),
      ...(isNewArrival && { arrival: 'yes' })
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

      {/* Product Type */}
      <div className="mb-4">
        <label className="font-bold block mb-1">Product Type</label>
        <label className="mr-4">
          <input
            type="radio"
            value="single"
            checked={productType === 'single'}
            onChange={() => setProductType('single')}
            className="mr-1"
          />
          1 Item
        </label>
        <label>
          <input
            type="radio"
            value="collection"
            checked={productType === 'collection'}
            onChange={() => setProductType('collection')}
            className="mr-1"
          />
          Collection
        </label>
      </div>

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

      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <input
        type="number"
        step="0.01"
        placeholder="Discounted Price"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {/* Stock for single item */}
      {productType === 'single' && (
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />
      )}

      {/* Color + Qty for collections */}
      {productType === 'collection' && (
        <div className="mb-4">
          <label className="font-bold block">Color & Quantity</label>
          {colorQtyList.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
<select
  value={item.code}
  onChange={(e) => {
    const selectedCode = e.target.value;
    const selectedColor = filteredColors.find(c => c.code === selectedCode);

    const newList = [...colorQtyList];
    newList[idx].code = selectedCode;
    newList[idx].img = selectedColor ? [selectedColor.img] : []; // use the actual color img
    setColorQtyList(newList);
  }}
  className="border p-2 flex-1"
>
  <option value="">Select Color</option>
  {filteredColors.map((col) => (
    <option key={col.code} value={col.code}>{col.code}</option>
  ))}
</select>

              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => {
                  const newList = [...colorQtyList];
                  newList[idx].qty = e.target.value;
                  setColorQtyList(newList);
                }}
                className="border p-2 w-24"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddColorQty}
            className="text-blue-500"
          >
            + Add Color
          </button>
        </div>
      )}

      {/* Sizes */}
      <div className="mb-4">
        <label className="font-bold block">Sizes</label>
        {sizeList.map((size, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Size ${idx + 1}`}
            value={size}
            onChange={(e) => {
              const updated = [...sizeList];
              updated[idx] = e.target.value;
              setSizeList(updated);
            }}
            className="w-full border p-2 mb-2"
          />
        ))}
        <button
          type="button"
          onClick={handleAddSize}
          className="text-blue-500"
        >
          + Add Size
        </button>
      </div>

      <label className="block text-lg font-bold mb-2">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write your product description here..."
      />

      <Upload onFilesUpload={handleImgChange} />

      <div className="flex items-center my-4">
        <input
          type="checkbox"
          id="newArrival"
          checked={isNewArrival}
          onChange={(e) => setIsNewArrival(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="newArrival" className="text-lg font-bold">New Arrival</label>
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Save Product
      </button>
    </form>
  );
}
