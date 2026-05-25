const CART_ANIMATION_EVENT = "hapto:cart-animation";
const CART_ANIMATION_STORAGE_KEY = "hapto:cart-animation-request";
const CART_ANIMATION_MAX_AGE_MS = 2500;
const CART_STATE_EVENT = "hapto:cart-state";
const CART_STATE_STORAGE_KEY = "hapto:cart-state";

const createAnimationRequest = () => ({
  id: `cart-${Date.now()}`,
  timestamp: Date.now(),
});

export const triggerCartAnimation = () => {
  if (typeof window === "undefined") {
    return;
  }

  const request = createAnimationRequest();

  window.sessionStorage.setItem(
    CART_ANIMATION_STORAGE_KEY,
    JSON.stringify(request)
  );
  window.dispatchEvent(
    new CustomEvent(CART_ANIMATION_EVENT, {
      detail: request,
    })
  );
};

export const readPendingCartAnimation = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(CART_ANIMATION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const request = JSON.parse(rawValue);

    if (!request?.timestamp) {
      return null;
    }

    if (Date.now() - request.timestamp > CART_ANIMATION_MAX_AGE_MS) {
      window.sessionStorage.removeItem(CART_ANIMATION_STORAGE_KEY);
      return null;
    }

    return request;
  } catch (error) {
    console.error("Impossible de lire l'animation panier :", error);
    window.sessionStorage.removeItem(CART_ANIMATION_STORAGE_KEY);
    return null;
  }
};

export const clearPendingCartAnimation = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(CART_ANIMATION_STORAGE_KEY);
};

export const notifyCartState = (itemCount) => {
  if (typeof window === "undefined") {
    return;
  }

  const nextState = {
    itemCount: Math.max(0, Number(itemCount) || 0),
    timestamp: Date.now(),
  };

  window.sessionStorage.setItem(
    CART_STATE_STORAGE_KEY,
    JSON.stringify(nextState)
  );
  window.dispatchEvent(
    new CustomEvent(CART_STATE_EVENT, {
      detail: nextState,
    })
  );
};

export const readStoredCartState = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(CART_STATE_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const state = JSON.parse(rawValue);

    if (typeof state?.itemCount !== "number") {
      return null;
    }

    return state;
  } catch (error) {
    console.error("Impossible de lire l'état du panier :", error);
    window.sessionStorage.removeItem(CART_STATE_STORAGE_KEY);
    return null;
  }
};

export const clearStoredCartState = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(CART_STATE_STORAGE_KEY);
};

export { CART_ANIMATION_EVENT, CART_STATE_EVENT };

