'use client';

import { useState, useEffect } from 'react'; 
import Upload from '../components/Upload';

const ManageCategory = () => {
  const [formData, setFormData] = useState({ code: '', category: '', img: [] });
  const [editFormData, setEditFormData] = useState({ id: '', code: '', category: '', img: [] });
  const [message, setMessage] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [img, setImg] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [subRes, catRes] = await Promise.all([
          fetch('/api/color'),
          fetch('/api/category'),
        ]);

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubCategories(subData);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setMainCategories(catData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/color', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Added successfully!');
      setFormData({ code: '', category: '', img: [] });
      window.location.href = '/color';
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };

  const handleEdit = (category) => {
    setEditMode(true);
    setEditFormData({
      id: category.id,
      code: category.code,
      category: category.category,
      img: category.img,
    });
    setImg(category.img);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/color?id=${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editFormData.code,
          category: editFormData.category,
          img: img,
        }),
      });

      if (res.ok) {
        window.location.reload();
        setEditFormData({ id: '', code: '', category: '', img: [] });
        setEditMode(false);
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm(`Are you sure you want to delete this?`)) {
      try {
        const res = await fetch(`/api/color?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setMessage('Deleted successfully!');
          window.location.href = '/color';
        } else {
          const errorData = await res.json();
          setMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };


  const handleImgChange = (url) => {
    if (url) {
      setImg(url); 
    }
  };

  useEffect(() => {
    if (!img.includes('')) {
      setFormData((prevState) => ({ ...prevState, img }));
    }
  }, [img]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit' : 'Add'}</h1>
      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Code</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={editMode ? editFormData.code : formData.code}
            onChange={(e) =>
              editMode
                ? setEditFormData({ ...editFormData, code: e.target.value })
                : setFormData({ ...formData, code: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select
            className="border p-2 w-full"
            value={editMode ? editFormData.category : formData.category}
            onChange={(e) =>
              editMode
                ? setEditFormData({ ...editFormData, category: e.target.value })
                : setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="">Select a category</option>
            {mainCategories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <Upload onImagesUpload={handleImgChange} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editMode ? 'Update' : 'Add'}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}

      <h2 className="text-xl font-bold mt-8">All</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Code</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subCategories.length > 0 ? (
            subCategories.map((category) => {
              const fileUrl = category.img[0];
              const isVideo = /\.(mp4|webm|ogg)$/i.test(fileUrl);
              return (
                <tr key={category.id}>
                  <td className="border border-gray-300 p-2">{category.code}</td>
                  <td className="border border-gray-300 p-2">{category.category}</td>
                  <td className="border border-gray-300 p-2">
                    {isVideo ? (
                      <video controls className="w-24 h-auto">
                        <source src={fileUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={fileUrl} alt="Product Image" className="w-24 h-auto" />
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="border border-gray-300 p-2 text-center">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategory;
