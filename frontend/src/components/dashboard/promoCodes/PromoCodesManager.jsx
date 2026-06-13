import { useEffect, useState } from "react";
import {
  createPromoCode,
  deletePromoCode,
  getPromoCodes,
} from "../../../services/promoCode.service";
import "./PromoCodesManager.css";

const createInitialForm = () => ({
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minAmount: "",
  maxUses: "",
  expiresAt: "",
  isActive: true,
});

const formatDate = (value) => {
  if (!value) {
    return "Aucune";
  }

  return new Date(value).toLocaleDateString("fr-FR");
};

const formatDiscount = (promoCode) => {
  const discountValue = Number(promoCode.discountValue) || 0;

  if (promoCode.discountType === "PERCENTAGE") {
    return `${discountValue} %`;
  }

  return `${discountValue} EUR`;
};

const formatMinAmount = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Aucun";
  }

  return `${Number(value) || 0} EUR`;
};

function PromoCodesManager() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [form, setForm] = useState(createInitialForm);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        setLoading(true);
        const data = await getPromoCodes();
        setPromoCodes(Array.isArray(data) ? data : []);
        setFeedback({ type: "", message: "" });
      } catch (error) {
        console.error(error);
        setFeedback({
          type: "error",
          message: "Impossible de charger les codes promos.",
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchPromoCodes();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setFeedback({ type: "", message: "" });

      const payload = {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: form.discountValue,
        minAmount: form.minAmount === "" ? null : form.minAmount,
        maxUses: form.maxUses === "" ? null : form.maxUses,
        expiresAt: form.expiresAt === "" ? null : form.expiresAt,
        isActive: form.isActive,
      };

      const createdPromoCode = await createPromoCode(payload);

      setPromoCodes((previousPromoCodes) => [
        createdPromoCode,
        ...previousPromoCodes,
      ]);
      setForm(createInitialForm());
      setFeedback({
        type: "success",
        message: "Code promo ajouté.",
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Impossible d'ajouter ce code promo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (promoCodeId, code) => {
    if (!window.confirm(`Supprimer le code promo ${code} ?`)) {
      return;
    }

    try {
      setFeedback({ type: "", message: "" });
      await deletePromoCode(promoCodeId);
      setPromoCodes((previousPromoCodes) =>
        previousPromoCodes.filter((promoCode) => promoCode.id !== promoCodeId)
      );
      setFeedback({
        type: "success",
        message: "Code promo supprimé.",
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Impossible de supprimer ce code promo.",
      });
    }
  };

  if (loading) {
    return <p className="promo-codes-loading">Chargement des codes promos...</p>;
  }

  return (
    <section className="promo-codes-manager">
      <div className="promo-codes-manager__header">
        <div>
          <h1 className="dashboard-title">Codes promos</h1>
          <p className="promo-codes-manager__subtitle">
            Ajoutez et supprimez les codes promos disponibles sur le site.
          </p>
        </div>
      </div>

      {feedback.message ? (
        <p
          className={`promo-codes-feedback ${
            feedback.type === "error"
              ? "promo-codes-feedback--error"
              : "promo-codes-feedback--success"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      <div className="promo-codes-manager__layout">
        <form className="promo-codes-form" onSubmit={handleSubmit}>
          <h2>Ajouter un code promo</h2>

          <div className="promo-codes-form__grid">
            <label className="promo-codes-form__field">
              <span>Code</span>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="HAPTO10"
                required
              />
            </label>

            <label className="promo-codes-form__field">
              <span>Type</span>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
              >
                <option value="PERCENTAGE">Pourcentage</option>
                <option value="FIXED">Montant fixe</option>
              </select>
            </label>

            <label className="promo-codes-form__field">
              <span>Valeur</span>
              <input
                type="number"
                name="discountValue"
                value={form.discountValue}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="10"
                required
              />
            </label>

            <label className="promo-codes-form__field">
              <span>Montant minimum</span>
              <input
                type="number"
                name="minAmount"
                value={form.minAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="50"
              />
            </label>

            <label className="promo-codes-form__field">
              <span>Utilisations max</span>
              <input
                type="number"
                name="maxUses"
                value={form.maxUses}
                onChange={handleChange}
                min="1"
                step="1"
                placeholder="100"
              />
            </label>

            <label className="promo-codes-form__field">
              <span>Date d'expiration</span>
              <input
                type="date"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="promo-codes-form__checkbox">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <span>Code actif</span>
          </label>

          <button
            type="submit"
            className="promo-codes-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter le code promo"}
          </button>
        </form>

        <div className="promo-codes-table-shell">
          <table className="promo-codes-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Remise</th>
                <th>Minimum</th>
                <th>Expiration</th>
                <th>Usages</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promoCode) => (
                <tr key={promoCode.id}>
                  <td>
                    <strong>{promoCode.code}</strong>
                  </td>
                  <td>{formatDiscount(promoCode)}</td>
                  <td>{formatMinAmount(promoCode.minAmount)}</td>
                  <td>{formatDate(promoCode.expiresAt)}</td>
                  <td>
                    {promoCode.currentUses}
                    {promoCode.maxUses ? ` / ${promoCode.maxUses}` : " / ∞"}
                  </td>
                  <td>
                    <span
                      className={`promo-codes-badge ${
                        promoCode.isActive
                          ? "promo-codes-badge--active"
                          : "promo-codes-badge--inactive"
                      }`}
                    >
                      {promoCode.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="promo-codes-table__actions">
                    <button
                      type="button"
                      className="promo-codes-table__delete"
                      onClick={() => handleDelete(promoCode.id, promoCode.code)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {promoCodes.length === 0 ? (
            <p className="promo-codes-empty">
              Aucun code promo pour l&apos;instant.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default PromoCodesManager;
