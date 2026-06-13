import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout/DashboardLayout";
import BlogForm from "../../components/dashboard/blogs/BlogForm";
import BlogsList from "../../components/dashboard/blogs/BlogsList";
import Newsletter from "../../components/dashboard/newsletter/Newsletter";
import PromoCodesManager from "../../components/dashboard/promoCodes/PromoCodesManager";
import StatsCards from "../../components/dashboard/StatsCards/StatsCards";
import ProductsList from "../../components/dashboard/products/ProductsList";
import ProductForm from "../../components/dashboard/products/ProductForm"; 
import UsersList from "../../components/dashboard/users/UsersList";
import "./DashboardPage.css";

function DashboardPage() {
  const { pathname } = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogRefreshKey, setBlogRefreshKey] = useState(0);

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

      case "/dashboard/users":
        return (
          <>
            <h1 className="dashboard-title">Gestion des utilisateurs</h1>
            <UsersList />
          </>
        );

      case "/dashboard/blogs":
        return (
          <>
            <BlogsList
              refreshToken={blogRefreshKey}
              onEdit={(blog) => {
                setSelectedBlog(blog);
                setShowBlogForm(true);
              }}
              onAdd={() => {
                setSelectedBlog(null);
                setShowBlogForm(true);
              }}
            />

            {showBlogForm && (
              <BlogForm
                blog={selectedBlog}
                onClose={() => setShowBlogForm(false)}
                onSave={() => {
                  setShowBlogForm(false);
                  setBlogRefreshKey((previousValue) => previousValue + 1);
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

      case "/dashboard/codes-promos":
        return <PromoCodesManager />;

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
