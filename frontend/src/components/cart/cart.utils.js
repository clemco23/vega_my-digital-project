export const formatPrice = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const getItemTypeLabel = (productType) => {
  if (productType === "BOARD") {
    return "Planche";
  }

  if (productType === "MODULE") {
    return "Module";
  }

  if (productType === "SET_PREDEFINED") {
    return "Pack";
  }

  return "Produit";
};

