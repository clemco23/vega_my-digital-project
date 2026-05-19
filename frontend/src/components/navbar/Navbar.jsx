import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import haptoLogo from "../../assets/hapto.svg";
import { apiBaseUrl } from "../../services/apiBase";
import { getCurrentUser } from "../../services/auth.service";
import "./Navbar.css";

const navItems = [
  { label: "ACCUEIL", to: "/", matchPaths: ["/"] },
  { label: "A PROPOS", to: "/about", matchPaths: ["/about"] },
  { label: "LA PLANCHE", to: "/", matchPaths: ["/planche", "/la-planche"] },
  { label: "CONTACT", to: "/", matchPaths: ["/contact"] },
];

const readStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.error("Impossible de lire l'utilisateur stocke :", error);
    return null;
  }
};

const getUserInitials = (user) => {
  const initials = [user?.firstname, user?.name]
    .filter(Boolean)
    .map((value) => value.trim().charAt(0))
    .join("")
    .slice(0, 2);

  if (initials) {
    return initials.toUpperCase();
  }

  return (user?.email || "H").slice(0, 2).toUpperCase();
};

function Navbar() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const syncUser = async () => {
      const storedUser = readStoredUser();
      setUser(storedUser);
      setHasAvatarError(false);

      const token = window.localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const data = await getCurrentUser();
        const freshUser = data?.data;

        if (!freshUser) {
          return;
        }

        const mergedUser = {
          ...storedUser,
          ...freshUser,
        };

        window.localStorage.setItem("user", JSON.stringify(mergedUser));
        setUser(mergedUser);
      } catch (error) {
        console.error(
          "Impossible de rafraichir le profil utilisateur depuis l'API :",
          error
        );
      }
    };

    void syncUser();
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    setUser(null);
    closeMenu();
    window.location.href = `${apiBaseUrl}/auth/logout?redirect=${encodeURIComponent(window.location.origin)}`;
  };

  const userLabel =
    [user?.firstname, user?.name].filter(Boolean).join(" ").trim() ||
    user?.email ||
    "Utilisateur connecte";
  const firstName = user?.firstname || user?.name || "vous";
  const isAdmin = String(user?.role || "").toUpperCase() === "ADMIN";
  const isNavItemActive = (item) =>
    item.matchPaths.some(
      (routePath) =>
        pathname === routePath || pathname.startsWith(`${routePath}/`)
    );

  return (
    <header className="site-navbar">
      <div className="site-navbar__inner">
        <Link
          to="/"
          className="site-navbar__logo"
          aria-label="Retourner a l'accueil"
          onClick={closeMenu}
        >
          <img src={haptoLogo} alt="Hapto" />
        </Link>

        <button
          type="button"
          className="site-navbar__toggle"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="site-navbar__toggle-line site-navbar__toggle-line--top" />
          <span className="site-navbar__toggle-line site-navbar__toggle-line--middle" />
          <span className="site-navbar__toggle-line site-navbar__toggle-line--bottom" />
        </button>

        <div
          className={`site-navbar__panel ${isMenuOpen ? "site-navbar__panel--open" : ""}`}
        >
          <nav className="site-navbar__nav" aria-label="Navigation principale">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`site-navbar__link ${isNavItemActive(item) ? "site-navbar__link--active" : ""}`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-navbar__actions">
            {!user && (
              <Link
                to="/login"
                className="site-navbar__login"
                onClick={closeMenu}
              >
                Connexion
              </Link>
            )}

            {user && (
              <div className="site-navbar__user">
                <div className="site-navbar__user-copy">
                  <p className="site-navbar__greeting">Bonjour, {firstName}</p>
                </div>

                <div className="site-navbar__user-menu" ref={userMenuRef}>
                  <button
                      type="button"
                      className="site-navbar__avatar-button"
                    aria-label={userLabel}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="menu"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  >
                    <div className="site-navbar__avatar" title={userLabel}>
                      {user.avatar && !hasAvatarError ? (
                        <img
                          src={user.avatar}
                          alt={`Avatar de ${userLabel}`}
                          referrerPolicy="no-referrer"
                          onError={() => setHasAvatarError(true)}
                        />
                      ) : (
                        <span>{getUserInitials(user)}</span>
                      )}
                    </div>
                  </button>

                  <div
                    className={`site-navbar__user-links ${isUserMenuOpen ? "site-navbar__user-links--open" : ""}`}
                    role="menu"
                  >
                    {isAdmin && (
                      <Link
                        to="/dashboard"
                        className="site-navbar__user-link"
                        onClick={closeMenu}
                        role="menuitem"
                      >
                        Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profil"
                      className="site-navbar__user-link"
                      onClick={closeMenu}
                      role="menuitem"
                    >
                      Modifier profil
                    </Link>

                    <Link
                      to="/commandes"
                      className="site-navbar__user-link"
                      onClick={closeMenu}
                      role="menuitem"
                    >
                      Mes commandes
                    </Link>

                    <button
                      type="button"
                      className="site-navbar__logout"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      Se deconnecter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
