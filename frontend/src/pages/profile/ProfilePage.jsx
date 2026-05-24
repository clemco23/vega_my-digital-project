import { useEffect, useState } from "react";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import { getCurrentUserProfile } from "../../services/user.service";
import "./ProfilePage.css";

const formatRoleLabel = (role) => {
  if (!role) {
    return "Non defini";
  }

  return role === "ADMIN" ? "Administrateur" : "Utilisateur";
};

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      try {
        const currentUser = await getCurrentUserProfile();

        if (isCancelled) {
          return;
        }

        setProfile(currentUser);
        window.localStorage.setItem("user", JSON.stringify(currentUser));
      } catch (err) {
        if (isCancelled) {
          return;
        }

        setError(
          err.response?.data?.message ||
            "Impossible de charger votre profil pour le moment."
        );
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-page__content">
        <section className="profile-page__hero">
          <p className="profile-page__eyebrow">Profil</p>
          <h1>Mon profil</h1>
          <p className="profile-page__intro">
            Retrouvez ici les informations de votre compte connecte.
          </p>
        </section>

        <section className="profile-page__card" aria-live="polite">
          {loading && <p className="profile-page__status">Chargement du profil...</p>}

          {!loading && error && (
            <p className="profile-page__status profile-page__status--error">
              {error}
            </p>
          )}

          {!loading && !error && profile && (
            <div className="profile-page__grid">
              <article className="profile-page__field">
                <span className="profile-page__label">Prenom</span>
                <strong>{profile.firstname || "-"}</strong>
              </article>

              <article className="profile-page__field">
                <span className="profile-page__label">Nom</span>
                <strong>{profile.name || "-"}</strong>
              </article>

              <article className="profile-page__field">
                <span className="profile-page__label">Email</span>
                <strong>{profile.email || "-"}</strong>
              </article>

              <article className="profile-page__field">
                <span className="profile-page__label">Role</span>
                <strong>{formatRoleLabel(profile.role)}</strong>
              </article>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default ProfilePage;
