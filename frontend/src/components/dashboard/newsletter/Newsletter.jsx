import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNewsletterSubscribers } from "../../../services/newsletter.service";
import "./Newsletter.css";

function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setError("");
        const data = await getNewsletterSubscribers();
        setSubscribers(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error("Error fetching newsletter subscribers:", fetchError);
        setError("Impossible de récupérer les adresses email pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    void fetchSubscribers();
  }, []);

  if (loading) {
    return <p className="newsletter__state">Chargement des adresses email...</p>;
  }

  if (error) {
    return <p className="newsletter__state newsletter__state--error">{error}</p>;
  }

  return (
    <div className="newsletter">
      {subscribers.length === 0 ? (
        <p className="newsletter__state">Aucun inscrit à la newsletter.</p>
      ) : (
        <div className="newsletter__table-shell">
          <table className="newsletter__table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>{subscriber.email}</td>
                  <td>
                    {new Date(subscriber.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/dashboard" className="newsletter__back-link">
        Retour au dashboard
      </Link>
    </div>
  );
}

export default Newsletter;

