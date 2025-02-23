import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";

const AdminPages = () => {
    const addProduct = async (formData) => {
        try {
            const response = await fetch("http://localhost:9000/api/products", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Erreur lors de l'ajout du produit.");
            const newProduct = await response.json();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex w-full">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold">Gestion des produits</h1>
                <ProductForm addProduct={addProduct} />
                <ProductList />
            </main>
        </div>
    );
};

export default AdminPages;