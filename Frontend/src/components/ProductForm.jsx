import React, { useState } from "react";

const ProductForm = ({ addProduct }) => {
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(imageUrl);
      setNewProduct({ ...newProduct, image: imageUrl });
    }
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.stock || !newProduct.image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("image", newProduct.image);

    await addProduct(formData);

    setNewProduct({ title: "", description: "", price: "", stock: "", image: null });
    setPreview(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-pink-200 p-6 rounded-lg shadow-md w-[80%] mx-auto"
    >
      <input
        type="text"
        name="title"
        value={newProduct.title}
        onChange={handleChange}
        placeholder="PRODUCT NAME"
        className="w-full p-2 mb-2 bg-pink-100 rounded border-none outline-none"
      />
      <textarea
        name="description"
        value={newProduct.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 mb-2 bg-pink-100 rounded border-none outline-none"
      ></textarea>
      <div className="flex space-x-2">
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          placeholder="Prix"
          className="w-1/2 p-2 bg-pink-100 rounded border-none outline-none"
        />
        <input
          type="number"
          name="stock"
          value={newProduct.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-1/2 p-2 bg-pink-100 rounded border-none outline-none"
        />
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <input
          type="text"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="bg-cyan-300 text-amber-50 px-4 py-2 rounded cursor-pointer"
        >
          Upload
        </label>
      </div>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 w-full h-32 object-cover rounded"
        />
      )}

      <button
        type="submit"
        className="w-full mt-4 bg-cyan-300 text-amber-50 p-2 rounded"
      >
        ADD
      </button>
    </form>
  );
};

export default ProductForm;
