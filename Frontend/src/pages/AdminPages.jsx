import Sidebar from "../components/Sidebar";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";

const AdminPages = () => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <ProductForm />
        <ProductList />
      </main>
    </div>
  );
};

export default AdminPages;