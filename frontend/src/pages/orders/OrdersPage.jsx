import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import { formatPrice } from "../../components/cart/cart.utils";
import { getMyOrders } from "../../services/order.service";
import { createCheckoutSession } from "../../services/payment.service";
import "./OrdersPage.css";

const statusLabels = {
  PENDING: "En attente de paiement",
  PAID: "Payee",
  PREPARING: "En preparation",
  SHIPPED: "Expediee",
  DELIVERED: "Livree",
  CANCELLED: "Annulee",
  REFUNDED: "Remboursee",
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const getItemsCount = (order) =>
  (order.orderVariants || []).reduce(
    (accumulator, item) => accumulator + (Number(item.quantity) || 0),
    0
  );

const getAddressLine = (order) =>
  String(order.customerStreet || "").replace(/\s*\|\s*/g, " - ");

function OrdersPage() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingOrderId, setPayingOrderId] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const loadOrders = async () => {
      try {
        const nextOrders = await getMyOrders();

        if (isCancelled) {
          return;
        }

        setOrders(nextOrders);
      } catch (loadError) {
        if (isCancelled) {
          return;
        }

        console.error(loadError);
        setError("Impossible de charger vos commandes pour le moment.");
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isCancelled = true;
    };
  }, []);

  const createdOrderId = searchParams.get("created");
  const paymentState = searchParams.get("payment");
  const paymentOrderId = searchParams.get("order");

  const handlePayOrder = async (orderId) => {
    try {
      setPayingOrderId(orderId);
      setError("");
      const checkoutUrl = await createCheckoutSession(orderId);
      window.location.href = checkoutUrl;
    } catch (paymentError) {
      console.error(paymentError);
      setError(
        paymentError.response?.data?.message ||
          "Impossible de lancer le paiement pour cette commande."
      );
    } finally {
      setPayingOrderId(null);
    }
  };

  const bannerMessage =
    paymentState === "success" && paymentOrderId
      ? `Le paiement de votre commande #${paymentOrderId} a ete confirme.`
      : paymentState === "cancel" && paymentOrderId
        ? `Le paiement de votre commande #${paymentOrderId} a ete annule. Vous pouvez le reprendre ci-dessous.`
      : paymentState === "unavailable" && createdOrderId
      ? `Votre commande #${createdOrderId} a bien ete creee, mais la redirection vers Stripe a echoue. Vous pouvez reprendre le paiement ci-dessous.`
      : createdOrderId
        ? `Votre commande #${createdOrderId} a bien ete creee.`
        : "";

  return (
    <div className="orders-page">
      <Navbar />

      <main className="orders-page__content">
        <header className="orders-page__hero">
          <p className="orders-page__eyebrow">Commandes</p>
          <h1>Mes commandes</h1>
          <p>
            Retrouvez ici l&apos;historique de vos commandes et leur statut.
          </p>
        </header>

        {bannerMessage ? (
          <div className="orders-page__banner" role="status">
            {bannerMessage}
          </div>
        ) : null}

        {loading ? (
          <p className="orders-page__status">Chargement de vos commandes...</p>
        ) : null}

        {!loading && error ? (
          <p className="orders-page__status orders-page__status--error">
            {error}
          </p>
        ) : null}

        {!loading && !error && orders.length === 0 ? (
          <section className="orders-page__empty">
            <h2>Aucune commande pour le moment</h2>
            <p>
              Votre prochaine composition apparaitra ici des qu&apos;elle sera
              validee.
            </p>
            <Link to="/la-planche" className="orders-page__cta">
              Composer ma planche
            </Link>
          </section>
        ) : null}

        {!loading && !error && orders.length > 0 ? (
          <section className="orders-page__list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card__header">
                  <div>
                    <p className="order-card__number">Commande #{order.id}</p>
                    <p className="order-card__date">
                      Creee le {formatDate(order.createdAt || order.orderDate)}
                    </p>
                  </div>

                  <span
                    className={`order-card__status order-card__status--${String(order.orderStatus || "").toLowerCase()}`}
                  >
                    {statusLabels[order.orderStatus] || order.orderStatus}
                  </span>
                </div>

                <div className="order-card__meta">
                  <div className="order-card__meta-item">
                    <span>Articles</span>
                    <strong>{getItemsCount(order)}</strong>
                  </div>

                  <div className="order-card__meta-item">
                    <span>Total</span>
                    <strong>{formatPrice(order.totalAmount)}</strong>
                  </div>

                  <div className="order-card__meta-item">
                    <span>Livraison</span>
                    <strong>
                      {order.customerPostalCode} {order.customerCity}
                    </strong>
                  </div>
                </div>

                <div className="order-card__body">
                  <div className="order-card__section">
                    <p className="order-card__section-title">
                      Adresse de livraison
                    </p>
                    <p className="order-card__text">
                      {getAddressLine(order) || "Adresse non renseignee"}
                    </p>
                    <p className="order-card__text">
                      {order.customerPostalCode} {order.customerCity}
                    </p>
                  </div>

                  <div className="order-card__section">
                    <p className="order-card__section-title">Articles</p>
                    <ul className="order-card__items">
                      {(order.orderVariants || []).map((item) => (
                        <li key={`${order.id}-${item.productVariantId}`}>
                          <span>{item.productVariant.product.name}</span>
                          <strong>x{item.quantity}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {order.orderStatus === "PENDING" ? (
                  <div className="order-card__actions">
                    <button
                      type="button"
                      className="order-card__pay-button"
                      onClick={() => handlePayOrder(order.id)}
                      disabled={payingOrderId === order.id}
                    >
                      {payingOrderId === order.id
                        ? "Redirection..."
                        : "Payer maintenant"}
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}

export default OrdersPage;
