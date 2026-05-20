import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../../services/auth.service";
import "./Sidebar.css";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "▦" },
  { path: "/dashboard/produits", label: "Produits", icon: "📦" },
  { path: "/dashboard/commandes", label: "Commandes", icon: "🧾" },
  { path: "/dashboard/users", label: "Utilisateurs", icon: "👤" },
  { path: "/dashboard/blogs", label: "Blogs", icon: "✏️" },
  { path: "/dashboard/reviews", label: "Avis", icon: "⭐" },
  { path: "/dashboard/newsletter", label: "Newsletter", icon: "📧" },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>HAPTO</h2>
        <span>Admin</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              isActive ? "sidebar-link sidebar-link--active" : "sidebar-link"
            }
          >
            {/* <span className="sidebar-icon">{item.icon}</span> */}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <span>⇠</span>
        <span>Déconnexion</span>
      </button>
    </aside>
  );
}

export default Sidebar;