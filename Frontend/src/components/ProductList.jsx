import React, { useState, useEffect } from 'react'; 

export default function ProduitListe() {
    const [produits, setProduits] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [notification, setNotification] = useState("");
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        prix: "",
        stock: "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);  

    const fetchProduits = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/produits');
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des produits.");
            }
            const data = await response.json();
            setProduits(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduits();
    }, []);

    const handleEdit = (produit) => {
        setEditingProduct(produit._id);
        setFormData({
            titre: produit.titre,
            description: produit.description,
            prix: produit.prix,
            stock: produit.stock,
            image: null,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            let updatedData = new FormData();
            updatedData.append("titre", formData.titre);
            updatedData.append("description", formData.description);
            updatedData.append("prix", formData.prix);
            updatedData.append("stock", formData.stock);
            if (formData.image) {
                updatedData.append("image", formData.image);
            }

            const response = await fetch(`http://localhost:9000/api/produits/${editingProduct}`, {
                method: 'PUT',
                body: updatedData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour du produit.");
            }

            fetchProduits();
            setNotification('Produit mis à jour avec succès!');
            setTimeout(() => setNotification(''), 3000);
            setEditingProduct(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du produit:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:9000/api/produits/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression du produit.");
            }

            setProduits(produits.filter(produit => produit._id !== id));
            setNotification("Produit supprimé avec succès!");
            setTimeout(() => setNotification(''), 3000);
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFormData({ ...formData, image: file });
        }
    };

    return (
        <div className="table-fixed W-full border-collapse border border-gray-300">
        <div className="bg-purple-100 p-6 rounded-lg shadow-md w-[80%] mx-auto form-container">
            <h2 className="text-xl font-bold text-center mb-9 text-current">
                List of Products
            </h2>

            {loading ? <p>Loading...</p> : error && <p className="text-red-500">{error}</p>}
            {notification && <p className="text-green-500">{notification}</p>}

            {editingProduct && (
                <div className="mt-4 p-4 border">
                    <h3 className="font-semibold">Edit Product</h3>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={formData.titre}
                            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                            className="border p-2 mb-2 w-full rounded-lg shadow-md"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="border p-2 mb-2 w-full rounded-lg shadow-md"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={formData.prix}
                            onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                            className="border p-2 mb-2 w-full rounded-lg shadow-md"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="border p-2 mb-2 w-full rounded-lg shadow-md"
                            required
                        />
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Preview</label>
                                    <img 
                                        src={imagePreview}
                                        alt="Preview" 
                                        className="w-full h-40 object-cover rounded border mx-auto"
                                    />
                                </div>
                            )}
                        </div>

                        <button type="submit" className="bg-cyan-300 text-amber-50 rounded-lg shadow-md p-1">
                            Update
                        </button>
                        <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white rounded-lg shadow-md p-1 ml-2">
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <table className="table-overflow-x-auto w-full p-6 bg-pink-200 shadow-md rounded-xl">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Image</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Product</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Price</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Stock</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Description</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map((produit) => (
                        <tr key={produit._id}>
                            <td className="px-4 py-2 border rounded-lg shadow-md">
                                <img src={`http://localhost:9000/images/${produit.image}`} alt={produit.titre} className="h-16 w-auto mx-auto" />
                            </td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.titre}</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.prix} DH</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.stock}</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.description}</td>
                            <td className="px-4 py-2 border space-x-4">
                                <button onClick={() => handleEdit(produit)} className="bg-amber-600 text-white p-2 rounded-lg">Edit</button>
                                <button onClick={() => handleDelete(produit._id)} className="bg-red-600 text-white p-2 rounded-lg">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}