import { Link } from "react-router-dom";
import "./CartState.css";

function CartState({
  title,
  description,
  actionLabel,
  actionTo,
  variant = "default",
}) {
  return (
    <section
      className={`cart-state ${variant === "empty" ? "cart-state--empty" : ""}`}
    >
      {title ? <h2 className="cart-state__title">{title}</h2> : null}
      {description ? (
        <p className="cart-state__description">{description}</p>
      ) : null}

      {actionLabel && actionTo ? (
        <Link to={actionTo} className="cart-state__action">
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}

export default CartState;
