import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import { formatPrice } from "../../components/cart/cart.utils";
import { getMyOrders, getOrderById } from "../../services/order.service";
import { createCheckoutSession } from "../../services/payment.service";
import "./OrdersPage.css";

const statusLabels = {
  PENDING: "En attente de paiement",
  PAID: "Payée",
  PREPARING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
  REFUNDED: "Remboursée",
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
  const pendingOrderIds = orders
    .filter((order) => order.orderStatus === "PENDING")
    .map((order) => String(order.id))
    .join("|");

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
  const paymentOrder = orders.find(
    (order) => String(order.id) === String(paymentOrderId)
  );
  const isPaymentConfirmationPending =
    paymentState === "success" &&
    paymentOrderId &&
    paymentOrder?.orderStatus === "PENDING";

  useEffect(() => {
    if (paymentState !== "success" || !paymentOrderId) {
      return undefined;
    }

    let isCancelled = false;
    let timeoutId = null;
    let attempts = 0;

    const syncPaidOrder = async () => {
      try {
        const refreshedOrder = await getOrderById(paymentOrderId);

        if (isCancelled) {
          return;
        }

        setOrders((previousOrders) => {
          const hasOrder = previousOrders.some(
            (order) => String(order.id) === String(refreshedOrder.id)
          );

          if (!hasOrder) {
            return [refreshedOrder, ...previousOrders];
          }

          return previousOrders.map((order) =>
            String(order.id) === String(refreshedOrder.id) ? refreshedOrder : order
          );
        });

        if (refreshedOrder.orderStatus !== "PENDING") {
          return;
        }
      } catch (syncError) {
        if (!isCancelled) {
          console.error(syncError);
        }
      }

      attempts += 1;

      if (isCancelled || attempts >= 8) {
        return;
      }

      timeoutId = window.setTimeout(syncPaidOrder, 2000);
    };

    void syncPaidOrder();

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [paymentOrderId, paymentState]);

  useEffect(() => {
    if (!pendingOrderIds || loading) {
      return undefined;
    }

    let isCancelled = false;
    let attempts = 0;
    let intervalId = null;

    const refreshPendingOrders = async () => {
      try {
        const nextOrders = await getMyOrders();

        if (isCancelled) {
          return;
        }

        setOrders(nextOrders);

        const hasPendingOrder = nextOrders.some(
          (order) => order.orderStatus === "PENDING"
        );

        if (!hasPendingOrder) {
          window.clearInterval(intervalId);
        }
      } catch (refreshError) {
        if (!isCancelled) {
          console.error(refreshError);
        }
      } finally {
        attempts += 1;

        if (attempts >= 10) {
          window.clearInterval(intervalId);
        }
      }
    };

    intervalId = window.setInterval(refreshPendingOrders, 3000);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [loading, pendingOrderIds]);

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
      ? isPaymentConfirmationPending
        ? `Le paiement de votre commande #${paymentOrderId} a bien été reçu. Confirmation en cours...`
        : `Le paiement de votre commande #${paymentOrderId} a été confirmé.`
      : paymentState === "cancel" && paymentOrderId
        ? `Le paiement de votre commande #${paymentOrderId} a été annulé. Vous pouvez le reprendre ci-dessous.`
      : paymentState === "unavailable" && createdOrderId
      ? `Votre commande #${createdOrderId} a bien été créée, mais la redirection vers Stripe a échoué. Vous pouvez reprendre le paiement ci-dessous.`
      : createdOrderId
        ? `Votre commande #${createdOrderId} a bien été créée.`
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
              Votre prochaine composition apparaîtra ici dès qu&apos;elle sera
              validée.
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
                      Créée le {formatDate(order.createdAt || order.orderDate)}
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
                      {getAddressLine(order) || "Adresse non renseignée"}
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
                      disabled={
                        payingOrderId === order.id ||
                        (paymentState === "success" &&
                          String(paymentOrderId) === String(order.id))
                      }
                    >
                      {paymentState === "success" &&
                      String(paymentOrderId) === String(order.id)
                        ? "Confirmation en cours..."
                        : payingOrderId === order.id
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
