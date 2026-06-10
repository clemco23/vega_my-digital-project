import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CartEmptyState from "../../components/cart/CartEmptyState/CartEmptyState";
import CartHero from "../../components/cart/CartHero/CartHero";
import CartItemCard from "../../components/cart/CartItemCard/CartItemCard";
import CartState from "../../components/cart/CartState/CartState";
import CartSummary from "../../components/cart/CartSummary/CartSummary";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import { triggerCartAnimation } from "../../services/cart-feedback";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../services/cart.service";
import { getMyAddresses } from "../../services/address.service";
import { createOrder } from "../../services/order.service";
import { createCheckoutSession } from "../../services/payment.service";
import {
  getWishlist,
  removeWishlistItem,
} from "../../services/wishlist.service";
import "./CartPage.css";

const getPreferredAddress = (addresses = []) =>
  addresses.find((item) => item.addressType === "SHIPPING") || addresses[0] || null;

function CartPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isWishlistMode = pathname === "/favoris";
  const mode = isWishlistMode ? "wishlist" : "cart";

  const [selection, setSelection] = useState({ items: [], total: "0.00" });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(!isWishlistMode);
  const [error, setError] = useState("");
  const [addressMessage, setAddressMessage] = useState("");
  const [pendingItemId, setPendingItemId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isAddingWishlistToCart, setIsAddingWishlistToCart] = useState(false);

  const loadSelection = async () => {
    try {
      setError("");
      const nextSelection = isWishlistMode ? await getWishlist() : await getCart();
      setSelection(nextSelection);
    } catch (loadError) {
      console.error(loadError);
      setError(
        isWishlistMode
          ? "Impossible de charger vos favoris pour le moment."
          : "Impossible de charger votre panier pour le moment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelection({ items: [], total: "0.00" });
    setSelectedAddress(null);
    setLoading(true);
    setLoadingAddress(!isWishlistMode);
    setError("");
    setAddressMessage("");
    setPendingItemId(null);

    const loadPageData = async () => {
      try {
        const nextSelection = isWishlistMode ? await getWishlist() : await getCart();
        setSelection(nextSelection);
      } catch (loadError) {
        console.error(loadError);
        setError(
          isWishlistMode
            ? "Impossible de charger vos favoris pour le moment."
            : "Impossible de charger votre panier pour le moment."
        );
      } finally {
        setLoading(false);
      }

      if (isWishlistMode) {
        setLoadingAddress(false);
        return;
      }

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

    void loadPageData();
  }, [isWishlistMode]);

  const handleQuantityChange = async (item, nextQuantity) => {
    if (isWishlistMode) {
      return;
    }

    setPendingItemId(item.id);

    try {
      setError("");

      if (nextQuantity < 1) {
        await removeCartItem(item.id);
      } else {
        await updateCartItem(item.id, nextQuantity);
      }

      await loadSelection();
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

      if (isWishlistMode) {
        await removeWishlistItem(variantId);
      } else {
        await removeCartItem(variantId);
      }

      await loadSelection();
    } catch (removeError) {
      console.error(removeError);
      setError(
        removeError.response?.data?.message ||
          (isWishlistMode
            ? "Impossible de retirer ce favori."
            : "Impossible de retirer cet article.")
      );
    } finally {
      setPendingItemId(null);
    }
  };

  const handleClearSelection = async () => {
    setIsClearing(true);

    try {
      setError("");

      if (isWishlistMode) {
        for (const item of selection.items) {
          await removeWishlistItem(item.id);
        }
      } else {
        await clearCart();
      }

      await loadSelection();
    } catch (clearError) {
      console.error(clearError);
      setError(
        clearError.response?.data?.message ||
          (isWishlistMode
            ? "Impossible de vider vos favoris."
            : "Impossible de vider le panier.")
      );
    } finally {
      setIsClearing(false);
    }
  };

  const handleAddWishlistItemToCart = async (item) => {
    if (!item?.id) {
      return;
    }

    setPendingItemId(item.id);

    try {
      setError("");
      await addCartItem(item.id);
      triggerCartAnimation();
    } catch (addError) {
      console.error(addError);
      setError(
        addError.response?.data?.message ||
          "Impossible d'ajouter cet article au panier."
      );
    } finally {
      setPendingItemId(null);
    }
  };

  const handleAddWishlistToCart = async () => {
    if (selection.items.length === 0) {
      return;
    }

    try {
      setIsAddingWishlistToCart(true);
      setError("");

      for (const item of selection.items) {
        await addCartItem(item.id);
      }

      triggerCartAnimation();
      navigate("/panier");
    } catch (addError) {
      console.error(addError);
      setError(
        addError.response?.data?.message ||
          "Impossible d'ajouter vos favoris au panier."
      );
    } finally {
      setIsAddingWishlistToCart(false);
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
        "Impossible de creer votre commande.";

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

  const totalItems = selection.items.reduce(
    (accumulator, item) => accumulator + (Number(item.quantity) || 1),
    0
  );
  const isEmpty = !loading && selection.items.length === 0;

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-page__content">
        {!isEmpty ? <CartHero mode={mode} /> : null}

        {error ? <p className="cart-page__alert">{error}</p> : null}

        {loading ? (
          <CartState
            title={
              isWishlistMode
                ? "Chargement de vos favoris..."
                : "Chargement du panier..."
            }
          />
        ) : isEmpty ? (
          <CartEmptyState mode={mode} />
        ) : (
          <section className="cart-page__grid">
            <div className="cart-page__items">
              {selection.items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  mode={mode}
                  isPending={pendingItemId === item.id}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  onAddToCart={handleAddWishlistItemToCart}
                />
              ))}
            </div>

            <CartSummary
              mode={mode}
              totalItems={totalItems}
              totalAmount={selection.total}
              shippingAddress={selectedAddress}
              addressMessage={addressMessage}
              isLoadingAddress={loadingAddress}
              isPrimaryLoading={
                isWishlistMode ? isAddingWishlistToCart : isCreatingOrder
              }
              isClearing={isClearing}
              onPrimaryAction={
                isWishlistMode ? handleAddWishlistToCart : handleCheckout
              }
              onClear={handleClearSelection}
            />
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

export default CartPage;
