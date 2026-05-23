import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice, getItemTypeLabel } from "../cart.utils";
import "./CartItemCard.css";

function CartItemCard({ item, isPending, onQuantityChange, onRemove }) {
  const productImage = item.product.images?.[0]?.url;
  const itemTotal = Number(item.price) * item.quantity;

  return (
    <article className="cart-item">
      <div className="cart-item__media">
        {productImage ? (
          <img src={productImage} alt={item.product.name} />
        ) : (
          <span className="cart-item__fallback" aria-hidden="true">
            {item.product.name.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <div className="cart-item__content">
        <div className="cart-item__header">
          <div>
            <p className="cart-item__type">
              {getItemTypeLabel(item.product.productType)}
              {item.size ? ` - Taille ${item.size}` : ""}
            </p>
            <h2 className="cart-item__name">{item.product.name}</h2>
          </div>

          <p className="cart-item__price">{formatPrice(itemTotal)}</p>
        </div>

        <div className="cart-item__footer">
          <div className="cart-item__quantity" aria-label="Quantite">
            <button
              type="button"
              className="cart-item__quantity-btn"
              onClick={() => onQuantityChange(item, item.quantity - 1)}
              disabled={isPending}
              aria-label={`Retirer une unite de ${item.product.name}`}
            >
              <Minus size={16} />
            </button>

            <span className="cart-item__quantity-value">{item.quantity}</span>

            <button
              type="button"
              className="cart-item__quantity-btn"
              onClick={() => onQuantityChange(item, item.quantity + 1)}
              disabled={isPending}
              aria-label={`Ajouter une unite de ${item.product.name}`}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            className="cart-item__remove"
            onClick={() => onRemove(item.id)}
            disabled={isPending}
          >
            <Trash2 size={16} />
            Retirer
          </button>
        </div>
      </div>
    </article>
  );
}

export default CartItemCard;
