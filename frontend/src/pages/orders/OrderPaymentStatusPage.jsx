import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import {
  confirmCheckoutSession,
  createCheckoutSession,
} from "../../services/payment.service";
import "./OrderPaymentStatusPage.css";

function OrderPaymentStatusPage({ paymentStatus = "cancel" }) {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuccess = paymentStatus === "success";
  const [isRetrying, setIsRetrying] = useState(false);
  const [isConfirming, setIsConfirming] = useState(isSuccess);
  const [error, setError] = useState("");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!isSuccess || !sessionId) {
      setIsConfirming(false);
      return undefined;
    }

    let isCancelled = false;

    const confirmPayment = async () => {
      try {
        setError("");
        await confirmCheckoutSession(orderId, sessionId);

        if (isCancelled) {
          return;
        }

        navigate(`/commandes?payment=success&order=${orderId}`, {
          replace: true,
        });
      } catch (confirmationError) {
        if (isCancelled) {
          return;
        }

        console.error(confirmationError);
        setError(
          confirmationError.response?.data?.message ||
            "Impossible de confirmer le paiement pour cette commande."
        );
      } finally {
        if (!isCancelled) {
          setIsConfirming(false);
        }
      }
    };

    void confirmPayment();

    return () => {
      isCancelled = true;
    };
  }, [isSuccess, navigate, orderId, sessionId]);

  const handleRetryPayment = async () => {
    try {
      setIsRetrying(true);
      setError("");
      const checkoutUrl = await createCheckoutSession(orderId);
      window.location.href = checkoutUrl;
    } catch (paymentError) {
      console.error(paymentError);
      setError(
        paymentError.response?.data?.message ||
          "Impossible de relancer le paiement pour cette commande."
      );
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="order-payment-page">
      <Navbar />

      <main className="order-payment-page__content">
        <section className="order-payment-page__card">
          <p className="order-payment-page__eyebrow">Paiement</p>
          <h1>
            {isSuccess ? "Paiement confirmé" : "Paiement annulé"}
          </h1>

          <p className="order-payment-page__text">
            {isSuccess
              ? isConfirming
                ? `Le paiement de votre commande #${orderId} est en cours de vérification.`
                : `Le paiement de votre commande #${orderId} a bien été transmis à Stripe.`
              : `Votre commande #${orderId} est toujours en attente. Vous pouvez reprendre le paiement maintenant ou revenir plus tard depuis vos commandes.`}
          </p>

          {error ? (
            <p className="order-payment-page__error">{error}</p>
          ) : null}

          <div className="order-payment-page__actions">
            {!isSuccess ? (
              <button
                type="button"
                className="order-payment-page__button"
                onClick={handleRetryPayment}
                disabled={isRetrying}
              >
                {isRetrying ? "Redirection..." : "Reprendre le paiement"}
              </button>
            ) : null}

            <Link
              to={`/commandes?payment=${paymentStatus}&order=${orderId}`}
              className={`order-payment-page__button ${isSuccess ? "" : "order-payment-page__button--ghost"}`.trim()}
            >
              Voir mes commandes
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default OrderPaymentStatusPage;

