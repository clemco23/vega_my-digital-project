import { useEffect, useState } from "react";
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
import "./CartPage.css";

function CartPage() {
  const [cart, setCart] = useState({ items: [], total: "0.00" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingItemId, setPendingItemId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

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

  useEffect(() => {
    void loadCart();
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
          "La mise a jour du panier a echoue."
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
              isClearing={isClearing}
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
