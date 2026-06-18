import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./StatsCards.css";
import { Link } from "react-router-dom";

const cards = [
  { key: "usersCount", label: "Utilisateurs", icon: "👤", suffix: "", link: "/dashboard/users" },
  { key: "contactCount", label: "Messages", icon: "📧", suffix: "", link: "/dashboard/contact" },
  { key: "ordersCount", label: "Commandes", icon: "🧾", suffix: "", link: "/dashboard/commandes" },
  { key: "productsCount", label: "Produits", icon: "📦", suffix: "", link: "/dashboard/products" },
  { key: "totalRevenue", label: "Chiffre d'affaires", icon: "💰", suffix: "€", link: "/dashboard/revenue" },
  { key: "newsletterCount", label: "Newsletters", icon: "📧", suffix: "", link: "/dashboard/newsletters" },
  { key: "blogsCount", label: "blogs", icon: "✏️", suffix: "", link: "/dashboard/blogs" },
  { key: "codepromoCount", label: "Codes promo", icon: "🏷️", suffix: "", link: "/dashboard/promo-codes" },
];

function StatsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/stats");
        setStats(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="stats-loading">Chargement...</p>;

  return (
    <div className="stats-cards">
      {cards.map((card) => (
        <Link to={card.link} key={card.key} className="stats-card-link">
          <div key={card.key} className="stats-card">
            <div className="stats-card__icon">{card.icon}</div>
            <div className="stats-card__info">
              <p className="stats-card__value">
                {stats?.[card.key]}{card.suffix}
              </p>
              <p className="stats-card__label">{card.label}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default StatsCards;