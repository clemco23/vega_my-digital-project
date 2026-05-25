import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartEmptyState from "../../components/cart/CartEmptyState/CartEmptyState";
import CartHero from "../../components/cart/CartHero/CartHero";
import CartItemCard from "../../components/cart/CartItemCard/CartItemCard";
import CartState from "../../components/cart/CartState/CartState";
import CartSummary from "../../components/cart/CartSummary/CartSummary";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../services/cart.service";
import { getMyAddresses } from "../../services/address.service";
import { createOrder } from "../../services/order.service";
import { createCheckoutSession } from "../../services/payment.service";
import "./CartPage.css";

const getPreferredAddress = (addresses = []) =>
  addresses.find((item) => item.addressType === "SHIPPING") || addresses[0] || null;

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: "0.00" });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [error, setError] = useState("");
  const [addressMessage, setAddressMessage] = useState("");
  const [pendingItemId, setPendingItemId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const loadCart = async () => {
    try {
      setError("");
      const nextCart = await getCart();
      setCart(nextCart);
    } catch (loadError) {
      console.error(loadError);
      setError("Impossible de charger votre panier pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  const loadAddress = async () => {
    try {
      const addresses = await getMyAddresses();
      const preferredAddress = getPreferredAddress(addresses);

      setSelectedAddress(preferredAddress);
      setAddressMessage(
        preferredAddress
          ? ""
          : "Ajoutez une adresse de livraison depuis votre profil avant de valider votre panier."
      );
    } catch (addressLoadError) {
      console.error(addressLoadError);
      setSelectedAddress(null);
      setAddressMessage(
        "Impossible de charger votre adresse de livraison pour le moment."
      );
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    void loadCart();
    void loadAddress();
  }, []);

  const handleQuantityChange = async (item, nextQuantity) => {
    setPendingItemId(item.id);

    try {
      setError("");

      if (nextQuantity < 1) {
        await removeCartItem(item.id);
      } else {
        await updateCartItem(item.id, nextQuantity);
      }

      await loadCart();
    } catch (updateError) {
      console.error(updateError);
      setError(
        updateError.response?.data?.message ||
          "La mise à jour du panier a échoué."
      );
    } finally {
      setPendingItemId(null);
    }
  };

  const handleRemoveItem = async (variantId) => {
    setPendingItemId(variantId);

    try {
      setError("");
      await removeCartItem(variantId);
      await loadCart();
    } catch (removeError) {
      console.error(removeError);
      setError(
        removeError.response?.data?.message ||
          "Impossible de retirer cet article."
      );
    } finally {
      setPendingItemId(null);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);

    try {
      setError("");
      await clearCart();
      await loadCart();
    } catch (clearError) {
      console.error(clearError);
      setError(
        clearError.response?.data?.message ||
          "Impossible de vider le panier."
      );
    } finally {
      setIsClearing(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress?.id) {
      setError(
        "Ajoutez une adresse de livraison dans votre profil avant de valider votre panier."
      );
      return;
    }

    let createdOrder = null;

    try {
      setIsCreatingOrder(true);
      setError("");

      createdOrder = await createOrder(selectedAddress.id);
      const checkoutUrl = await createCheckoutSession(createdOrder.id);
      window.location.href = checkoutUrl;
    } catch (createOrderError) {
      console.error(createOrderError);
      const errorMessage =
        createOrderError.response?.data?.message ||
        "Impossible de créer votre commande.";

      if (createdOrder?.id) {
        navigate(
          `/commandes?created=${encodeURIComponent(createdOrder.id)}&payment=unavailable`
        );
        return;
      }

      setError(errorMessage);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const totalItems = cart.items.reduce(
    (accumulator, item) => accumulator + item.quantity,
    0
  );
  const isEmpty = !loading && cart.items.length === 0;

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-page__content">
        {!isEmpty ? <CartHero /> : null}

        {error ? <p className="cart-page__alert">{error}</p> : null}

        {loading ? (
          <CartState title="Chargement du panier..." />
        ) : isEmpty ? (
          <CartEmptyState />
        ) : (
          <section className="cart-page__grid">
            <div className="cart-page__items">
              {cart.items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  isPending={pendingItemId === item.id}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            <CartSummary
              totalItems={totalItems}
              totalAmount={cart.total}
              shippingAddress={selectedAddress}
              addressMessage={addressMessage}
              isLoadingAddress={loadingAddress}
              isCreatingOrder={isCreatingOrder}
              isClearing={isClearing}
              onCheckout={handleCheckout}
              onClear={handleClearCart}
            />
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

export default CartPage;

