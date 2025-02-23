import React, { useState, useEffect } from "react";
import { gsap } from "gsap";

export default function ProductForm({ onProductAdded }) {
    const [formProduit, setFormProduit] = useState({
        image: null,
        title: "",
        description: "",
        price: "",
        stock: "",
    });
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        gsap.fromTo(
            ".form-container",
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
        );
    }, []);

    const handleChange = (e) => {
        setFormProduit({ ...formProduit, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setFormProduit({ ...formProduit, image: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        const { image, title, description, price, stock } = formProduit;
        if (!image || !title || !description || !price || !stock) {
            setMessage({ type: "error", text: "Veuillez remplir tous les champs." });
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock);

        try {
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setMessage({ type: "success", text: "Produit ajouté avec succès !" });
                setFormProduit({ image: null, title: "", description: "", price: "", stock: "" });
                setPreview(null);
                if (onProductAdded) onProductAdded(data);
            } else {
                setMessage({ type: "error", text: "Une erreur est survenue lors de l'ajout du produit." });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "Une erreur est survenue lors de l'ajout du produit.",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-pink-200 p-6 rounded-lg shadow-md w-[80%] mx-auto form-container"
        >
            <input
                type="text"
                name="title"
                value={formProduit.title}
                onChange={handleChange}
                placeholder="Nom du produit"
                className="w-full p-2 mb-2 bg-pink-100 rounded border-none outline-none"
            />
            <textarea
                name="description"
                value={formProduit.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-2 mb-2 bg-pink-100 rounded border-none outline-none"
            ></textarea>
            <div className="flex space-x-2">
                <input
                    type="number"
                    name="price"
                    value={formProduit.price}
                    onChange={handleChange}
                    placeholder="Prix"
                    className="w-1/2 p-2 bg-pink-100 rounded border-none outline-none"
                />
                <input
                    type="number"
                    name="stock"
                    value={formProduit.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    className="w-1/2 p-2 bg-pink-100 rounded border-none outline-none"
                />
            </div>

            <div className="flex items-center space-x-2 mt-2">
                <input
                    type="file"
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

            {message.text && (
                <div className={`mt-2 text-${message.type === 'error' ? 'red' : 'green'}-600`}>
                    {message.text}
                </div>
            )}

            <button
                type="submit"
                className="w-full mt-4 bg-cyan-300 text-amber-50 p-2 rounded"
            >
                ADD
            </button>
        </form>
    );
}
