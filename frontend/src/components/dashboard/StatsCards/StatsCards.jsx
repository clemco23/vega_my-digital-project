import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./StatsCards.css";

const cards = [
  { key: "usersCount", label: "Utilisateurs", icon: "👤", suffix: "" },
  { key: "ordersCount", label: "Commandes", icon: "🧾", suffix: "" },
  { key: "productsCount", label: "Produits", icon: "📦", suffix: "" },
  { key: "totalRevenue", label: "Chiffre d'affaires", icon: "💰", suffix: "€" },
  { key: "newsletterCount", label: "Newsletters", icon: "📧", suffix: "" },
  { key: "blogsCount", label: "blogs", icon: "✏️", suffix: "" },
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
        <div key={card.key} className="stats-card">
          <div className="stats-card__icon">{card.icon}</div>
          <div className="stats-card__info">
            <p className="stats-card__value">
              {stats?.[card.key]}{card.suffix}
            </p>
            <p className="stats-card__label">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;