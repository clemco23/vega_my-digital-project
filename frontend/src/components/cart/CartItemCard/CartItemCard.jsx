import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice, getItemTypeLabel } from "../cart.utils";
import "./CartItemCard.css";

const buildPackItemMeta = (packItem) => {
  const parts = [getItemTypeLabel(packItem.product.productType)];

  if (packItem.size) {
    parts.push(`Taille ${packItem.size}`);
  }

  if (packItem.product.productType === "BOARD" && packItem.holesCount) {
    parts.push(`${packItem.holesCount} trous`);
  }

  if (packItem.product.productType === "MODULE" && packItem.holesRequired) {
    parts.push(`${packItem.holesRequired} trous`);
  }

  return parts.join(" - ");
};

function CartItemCard({
  item,
  mode = "cart",
  isPending,
  onQuantityChange,
  onRemove,
  onAddToCart,
}) {
  const isWishlist = mode === "wishlist";
  const productImage = item.product.images?.[0]?.url;
  const itemQuantity = Number(item.quantity) || 1;
  const itemTotal = Number(item.price) * itemQuantity;
  const packItems = item.packItems || [];

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

        {packItems.length > 0 ? (
          <div className="cart-item__pack">
            <div className="cart-item__pack-header">
              <p className="cart-item__pack-title">Contenu du pack</p>
              <span className="cart-item__pack-caption">
                Detail d&apos;une composition
              </span>
            </div>

            <div className="cart-item__pack-list">
              {packItems.map((packItem) => {
                const packItemImage = packItem.product.images?.[0]?.url;

                return (
                  <article className="cart-item__pack-item" key={packItem.id}>
                    <div className="cart-item__pack-item-main">
                      <div className="cart-item__pack-item-media">
                        {packItemImage ? (
                          <img src={packItemImage} alt={packItem.product.name} />
                        ) : (
                          <span aria-hidden="true">
                            {packItem.product.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="cart-item__pack-item-copy">
                        <p className="cart-item__pack-item-name">
                          {packItem.product.name}
                        </p>
                        <p className="cart-item__pack-item-meta">
                          {buildPackItemMeta(packItem)}
                        </p>
                      </div>
                    </div>

                    <span className="cart-item__pack-item-quantity">
                      x{packItem.quantity}
                    </span>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="cart-item__footer">
          {isWishlist ? (
            <div className="cart-item__actions">
              <button
                type="button"
                className="cart-item__move"
                onClick={() => onAddToCart(item)}
                disabled={isPending}
              >
                <ShoppingCart size={16} />
                Ajouter au panier
              </button>

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
          ) : (
            <>
              <div className="cart-item__quantity" aria-label="Quantite">
                <button
                  type="button"
                  className="cart-item__quantity-btn"
                  onClick={() => onQuantityChange(item, itemQuantity - 1)}
                  disabled={isPending}
                  aria-label={`Retirer une unite de ${item.product.name}`}
                >
                  <Minus size={16} />
                </button>

                <span className="cart-item__quantity-value">{itemQuantity}</span>

                <button
                  type="button"
                  className="cart-item__quantity-btn"
                  onClick={() => onQuantityChange(item, itemQuantity + 1)}
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
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default CartItemCard;
