import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import { clearStoredCartState } from "../../services/cart-feedback";
import { apiBaseUrl } from "../../services/apiBase";
import {
  createAddress,
  getMyAddresses,
  updateAddress,
} from "../../services/address.service";
import {
  deleteUserAccount,
  getCurrentUserProfile,
  updateUserProfile,
} from "../../services/user.service";
import "./ProfilePage.css";

const initialPersonalForm = {
  name: "",
  firstname: "",
  email: "",
};

const initialAddressForm = {
  number: "",
  street: "",
  extra: "",
  postalCode: "",
  city: "",
  country: "France",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPreferredAddress = (addresses = []) =>
  addresses.find((item) => item.addressType === "SHIPPING") || addresses[0] || null;

const toPersonalForm = (profile) => ({
  name: profile?.name || "",
  firstname: profile?.firstname || "",
  email: profile?.email || "",
});

const parseStreetLine = (streetLine = "") => {
  const [mainLine = "", extraLine = ""] = streetLine
    .split("|")
    .map((value) => value.trim());

  const numberMatch = mainLine.match(/^(\S+)\s+(.*)$/);

  if (!numberMatch) {
    return {
      number: "",
      street: mainLine,
      extra: extraLine,
    };
  }

  return {
    number: numberMatch[1],
    street: numberMatch[2],
    extra: extraLine,
  };
};

const toAddressForm = (address) => {
  if (!address) {
    return initialAddressForm;
  }

  const parsedStreet = parseStreetLine(address.street || "");

  return {
    number: parsedStreet.number,
    street: parsedStreet.street,
    extra: parsedStreet.extra,
    postalCode: address.postalCode || "",
    city: address.city || "",
    country: address.country || "France",
  };
};

const buildStreetLine = (form) => {
  const mainLine = [form.number.trim(), form.street.trim()]
    .filter(Boolean)
    .join(" ")
    .trim();
  const extraLine = form.extra.trim();

  if (!extraLine) {
    return mainLine;
  }

  return `${mainLine} | ${extraLine}`;
};

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);
  const [personalForm, setPersonalForm] = useState(initialPersonalForm);
  const [addressForm, setAddressForm] = useState(initialAddressForm);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [personalFeedback, setPersonalFeedback] = useState("");
  const [personalError, setPersonalError] = useState("");
  const [addressFeedback, setAddressFeedback] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      try {
        const [currentUser, addresses] = await Promise.all([
          getCurrentUserProfile(),
          getMyAddresses().catch(() => []),
        ]);

        if (isCancelled) {
          return;
        }

        const selectedAddress = getPreferredAddress(addresses);

        setProfile(currentUser);
        setAddress(selectedAddress);
        setPersonalForm(toPersonalForm(currentUser));
        setAddressForm(toAddressForm(selectedAddress));
        window.localStorage.setItem("user", JSON.stringify(currentUser));
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setPageError(
          error.response?.data?.message ||
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

  const clearClientSession = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    clearStoredCartState();
    window.dispatchEvent(new Event("storage"));
  };

  const handleLogout = () => {
    const redirectUrl = new URL("/accueil", window.location.origin).toString();

    clearClientSession();
    window.location.href = `${apiBaseUrl}/auth/logout?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handlePersonalChange = (event) => {
    const { name, value } = event.target;
    setPersonalForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddressForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleCancelPersonal = () => {
    setEditingPersonal(false);
    setPersonalError("");
    setPersonalFeedback("");
    setPersonalForm(toPersonalForm(profile));
  };

  const handleCancelAddress = () => {
    setEditingAddress(false);
    setAddressError("");
    setAddressFeedback("");
    setAddressForm(toAddressForm(address));
  };

  const handleSavePersonal = async (event) => {
    event.preventDefault();

    if (!profile?.id) {
      return;
    }

    const nextName = personalForm.name.trim();
    const nextFirstname = personalForm.firstname.trim();
    const nextEmail = personalForm.email.trim();

    if (!nextName || !nextFirstname || !nextEmail) {
      setPersonalError("Nom, prenom et email sont obligatoires.");
      setPersonalFeedback("");
      return;
    }

    if (!emailRegex.test(nextEmail)) {
      setPersonalError("Veuillez saisir une adresse email valide.");
      setPersonalFeedback("");
      return;
    }

    try {
      setSavingPersonal(true);
      setPersonalError("");
      setPersonalFeedback("");

      const updatedProfile = await updateUserProfile(profile.id, {
        name: nextName,
        firstname: nextFirstname,
        email: nextEmail,
      });

      setProfile(updatedProfile);
      setPersonalForm(toPersonalForm(updatedProfile));
      setEditingPersonal(false);
      setPersonalFeedback("Vos informations ont ete mises a jour.");
      window.localStorage.setItem("user", JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      setPersonalError(
        error.response?.data?.message ||
          "Impossible de mettre a jour vos informations."
      );
      setPersonalFeedback("");
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();

    const street = addressForm.street.trim();
    const postalCode = addressForm.postalCode.trim();
    const city = addressForm.city.trim();

    if (!street || !postalCode || !city) {
      setAddressError("Rue, code postal et ville sont obligatoires.");
      setAddressFeedback("");
      return;
    }

    try {
      setSavingAddress(true);
      setAddressError("");
      setAddressFeedback("");

      const payload = {
        street: buildStreetLine(addressForm),
        postalCode,
        city,
        country: addressForm.country || "France",
        addressType: "SHIPPING",
      };

      const savedAddress = address?.id
        ? await updateAddress(address.id, payload)
        : await createAddress(payload);

      setAddress(savedAddress);
      setAddressForm(toAddressForm(savedAddress));
      setEditingAddress(false);
      setAddressFeedback("Votre adresse a ete mise a jour.");
    } catch (error) {
      setAddressError(
        error.response?.data?.message ||
          "Impossible de mettre a jour votre adresse."
      );
      setAddressFeedback("");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile?.id || deletingAccount) {
      return;
    }

    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer votre profil ? Cette action est irreversible."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAccount(true);
      await deleteUserAccount(profile.id);
      clearClientSession();
      window.location.href = "/accueil";
    } catch (error) {
      setPersonalError(
        error.response?.data?.message ||
          "Impossible de supprimer votre profil pour le moment."
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-page__content">
        <div className="profile-page__topbar">
          <nav className="profile-page__tabs" aria-label="Navigation du compte">
            <NavLink
              to="/commandes"
              className={({ isActive }) =>
                isActive
                  ? "profile-page__tab profile-page__tab--active"
                  : "profile-page__tab"
              }
            >
              Commandes
            </NavLink>

            <NavLink
              to="/profil"
              className={({ isActive }) =>
                isActive
                  ? "profile-page__tab profile-page__tab--active"
                  : "profile-page__tab"
              }
            >
              Profil
            </NavLink>
          </nav>

          <button
            type="button"
            className="profile-page__logout"
            onClick={handleLogout}
          >
            Se deconnecter
          </button>
        </div>

        <header className="profile-page__hero">
          <h1>Mon profil</h1>
        </header>

        {loading ? (
          <p className="profile-page__status">Chargement du profil...</p>
        ) : null}

        {!loading && pageError ? (
          <p className="profile-page__status profile-page__status--error">
            {pageError}
          </p>
        ) : null}

        {!loading && !pageError ? (
          <>
            <section className="profile-page__grid">
              <article className="profile-section">
                <div className="profile-section__header">
                  <h2>Mes informations</h2>
                  <button
                    type="button"
                    className="profile-section__edit"
                    onClick={() => {
                      setEditingPersonal((previousValue) => !previousValue);
                      setPersonalError("");
                      setPersonalFeedback("");
                      if (editingPersonal) {
                        setPersonalForm(toPersonalForm(profile));
                      }
                    }}
                  >
                    {editingPersonal ? "Annuler" : "Modifier"}
                  </button>
                </div>

                <form className="profile-section__body" onSubmit={handleSavePersonal}>
                  <label className="profile-field">
                    <span>Nom</span>
                    <input
                      type="text"
                      name="name"
                      value={personalForm.name}
                      onChange={handlePersonalChange}
                      readOnly={!editingPersonal}
                      autoComplete="family-name"
                    />
                  </label>

                  <label className="profile-field">
                    <span>Prenom</span>
                    <input
                      type="text"
                      name="firstname"
                      value={personalForm.firstname}
                      onChange={handlePersonalChange}
                      readOnly={!editingPersonal}
                      autoComplete="given-name"
                    />
                  </label>

                  <label className="profile-field">
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={personalForm.email}
                      onChange={handlePersonalChange}
                      readOnly={!editingPersonal}
                      autoComplete="email"
                    />
                  </label>

                  <label className="profile-field">
                    <span>Telephone</span>
                    <input
                      type="tel"
                      value=""
                      placeholder="Bientot disponible"
                      readOnly
                      disabled
                    />
                  </label>

                  <label className="profile-field">
                    <span>Mot de passe</span>
                    <input
                      type="text"
                      value="************"
                      readOnly
                      disabled
                    />
                  </label>

                  <div className="profile-section__messages" aria-live="polite">
                    {personalFeedback ? (
                      <p className="profile-section__message">
                        {personalFeedback}
                      </p>
                    ) : null}

                    {personalError ? (
                      <p className="profile-section__message profile-section__message--error">
                        {personalError}
                      </p>
                    ) : null}
                  </div>

                  {editingPersonal ? (
                    <div className="profile-section__actions">
                      <button
                        type="button"
                        className="profile-section__action profile-section__action--ghost"
                        onClick={handleCancelPersonal}
                      >
                        Annuler
                      </button>

                      <button
                        type="submit"
                        className="profile-section__action"
                        disabled={savingPersonal}
                      >
                        {savingPersonal ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </div>
                  ) : null}
                </form>
              </article>

              <article className="profile-section">
                <div className="profile-section__header">
                  <h2>Mon adresse</h2>
                  <button
                    type="button"
                    className="profile-section__edit"
                    onClick={() => {
                      setEditingAddress((previousValue) => !previousValue);
                      setAddressError("");
                      setAddressFeedback("");
                      if (editingAddress) {
                        setAddressForm(toAddressForm(address));
                      }
                    }}
                  >
                    {editingAddress ? "Annuler" : "Modifier"}
                  </button>
                </div>

                <form className="profile-section__body" onSubmit={handleSaveAddress}>
                  <label className="profile-field">
                    <span>Numero</span>
                    <input
                      type="text"
                      name="number"
                      value={addressForm.number}
                      onChange={handleAddressChange}
                      readOnly={!editingAddress}
                      autoComplete="address-line1"
                    />
                  </label>

                  <label className="profile-field">
                    <span>Rue</span>
                    <input
                      type="text"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      readOnly={!editingAddress}
                      autoComplete="street-address"
                    />
                  </label>

                  <label className="profile-field">
                    <span>Information complementaires</span>
                    <input
                      type="text"
                      name="extra"
                      value={addressForm.extra}
                      onChange={handleAddressChange}
                      readOnly={!editingAddress}
                      autoComplete="address-line2"
                    />
                  </label>

                  <label className="profile-field">
                    <span>Code Postal</span>
                    <input
                      type="text"
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressChange}
                      readOnly={!editingAddress}
                      autoComplete="postal-code"
                    />
                  </label>

                  <label className="profile-field">
                    <span>Ville</span>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      readOnly={!editingAddress}
                      autoComplete="address-level2"
                    />
                  </label>

                  <div className="profile-section__messages" aria-live="polite">
                    {addressFeedback ? (
                      <p className="profile-section__message">
                        {addressFeedback}
                      </p>
                    ) : null}

                    {addressError ? (
                      <p className="profile-section__message profile-section__message--error">
                        {addressError}
                      </p>
                    ) : null}
                  </div>

                  {editingAddress ? (
                    <div className="profile-section__actions">
                      <button
                        type="button"
                        className="profile-section__action profile-section__action--ghost"
                        onClick={handleCancelAddress}
                      >
                        Annuler
                      </button>

                      <button
                        type="submit"
                        className="profile-section__action"
                        disabled={savingAddress}
                      >
                        {savingAddress ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </div>
                  ) : null}
                </form>
              </article>
            </section>

            <div className="profile-page__footer-actions">
              <button
                type="button"
                className="profile-page__text-link profile-page__text-link--danger"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? "Suppression..." : "Supprimer mon profil"}
              </button>

              <button
                type="button"
                className="profile-page__text-link"
                disabled
              >
                Gerer mes preferences de notifications
              </button>
            </div>
          </>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}

export default ProfilePage;
