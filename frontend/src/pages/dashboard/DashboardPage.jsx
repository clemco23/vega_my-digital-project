import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout/DashboardLayout";
import Newsletter from "../../components/dashboard/newsletter/Newsletter";
import StatsCards from "../../components/dashboard/StatsCards/StatsCards";
import ProductsList from "../../components/dashboard/products/ProductsList";
import ProductForm from "../../components/dashboard/products/ProductForm"; 
import "./DashboardPage.css";

function DashboardPage() {
  const { pathname } = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const renderContent = () => {
    switch (pathname) {
      case "/dashboard":
        return (
          <>
            <h1 className="dashboard-title">Dashboard</h1>
            <StatsCards />
          </>
        );

      case "/dashboard/produits":
        return (
          <>
            <ProductsList
              onEdit={(product) => {
                setSelectedProduct(product);
                setShowForm(true);
              }}
              onAdd={() => {
                setSelectedProduct(null);
                setShowForm(true);
              }}
            />
            
            {showForm && (
              <ProductForm
                product={selectedProduct}
                onClose={() => setShowForm(false)}
                onSave={() => {
                  setShowForm(false);
                  // Recharger la liste
                }}
              />
            )}
          </>
        );

        case "/dashboard/newsletter":
          return (
            <>
              <h1 className="dashboard-title">Newsletter Subscribers</h1>
              <Newsletter />
            </>
          );

      default:
        return <h1 className="dashboard-title">Page en construction</h1>;
    }
  };

  return (
    <DashboardLayout>
      {renderContent()}
    </DashboardLayout>
  );
}

export default DashboardPage;
