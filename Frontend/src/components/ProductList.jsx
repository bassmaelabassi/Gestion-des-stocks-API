import React, { useState, useEffect } from 'react';

export default function ProduitListe() {
    const [produits, setProduits] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        prix: "",
        stock: "",
        image: ""
    });
    const [notification, setNotification] = useState("");

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/produits');
                if (!response.ok) throw new Error("Erreur lors de la récupération des produits.");
                const data = await response.json();
                setProduits(data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduits();
    }, []);

    const handleEdit = (produit) => {
        setEditingProduct(produit._id);
        setFormData({
            titre: produit.titre,
            description: produit.description,
            prix: produit.prix,
            stock: produit.stock,
            image: produit.image
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/produits/${editingProduct}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error("Erreur lors de la mise à jour du produit.");
            const updatedProduct = await response.json();
            setProduits(produits.map(prod => (prod._id === editingProduct ? updatedProduct : prod)));
            setNotification("Produit mis à jour avec succès!");

            setEditingProduct(null);
            setFormData({ titre: "", description: "", prix: "", stock: "", image: "" });
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/produits/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Erreur lors de la suppression du produit.");
            setProduits(produits.filter(produit => produit._id !== id));
            setNotification("Produit supprimé avec succès!");
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <div className="bg-pink-50 bg-auto mt-9">
            <h2 className="text-xl font-bold text-center mb-9 text-current underline decoration-pink-500">Liste des produits</h2>
            {loading ? <p>Chargement...</p> : error && <p className="text-red-500">{error}</p>}
            {notification && <p className="text-green-500">{notification}</p>}
            {editingProduct && (
                <div className="mt-4 p-4 border">
                    <h3 className="font-semibold">Modifier le produit</h3>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            placeholder="Titre"
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
                            placeholder="Prix"
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
                        <button type="submit" className="bg-purple-500 text-black rounded-lg shadow-md p-1">Mettre à jour le produit</button>
                        <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white rounded-lg shadow-md p-1 ml-2">Annuler</button>
                    </form>
                </div>
            )}
            <table className="table-auto w-full p-6 bg-white shadow-md rounded-xl">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Titre</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Prix</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Stock</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Description</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Image</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map(produit => (
                        <tr key={produit._id}>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.titre}</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.prix}DH</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.stock}</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.description}</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">
                                <img
                                    src={`http://localhost:5000/uploads/${produit.image}`}
                                    alt={produit.titre}
                                    className="h-16 w-auto mx-auto"
                                    onError={(e) => e.target.src = "https://via.placeholder.com/100"} 
                                />
                            </td>
                            <td className="px-4 py-2 border space-x-4">
                                <button onClick={() => handleEdit(produit)} className="bg-yellow-500 text-white p-2 rounded-lg">Modifier</button>
                                <button onClick={() => handleDelete(produit._id)} className="bg-pink-900 hover:bg-pink-400 text-white p-2 rounded-lg">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
