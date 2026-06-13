const prisma = require("../config/prisma");

const roundCurrency = (value) => {
  const numericValue = Number(value) || 0;
  return Math.round((numericValue + Number.EPSILON) * 100) / 100;
};

const normalizePromoCode = (code) => String(code || "").trim().toUpperCase();

const formatCurrency = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundCurrency(value));

const parseMoneyInput = (value, fieldName, { allowNull = false } = {}) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    if (allowNull) {
      return null;
    }

    throw new Error(`${fieldName} est obligatoire.`);
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    throw new Error(`${fieldName} doit être un nombre valide.`);
  }

  if (numericValue < 0) {
    throw new Error(`${fieldName} doit être supérieur ou égal à 0.`);
  }

  return roundCurrency(numericValue);
};

const parseStrictPositiveMoneyInput = (value, fieldName) => {
  const numericValue = parseMoneyInput(value, fieldName);

  if (numericValue <= 0) {
    throw new Error(`${fieldName} doit être supérieur à 0.`);
  }

  return numericValue;
};

const parseIntegerInput = (
  value,
  fieldName,
  { allowNull = false, min = 0 } = {}
) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    if (allowNull) {
      return null;
    }

    throw new Error(`${fieldName} est obligatoire.`);
  }

  const numericValue = Number(value);

  if (!Number.isInteger(numericValue)) {
    throw new Error(`${fieldName} doit être un entier.`);
  }

  if (numericValue < min) {
    throw new Error(`${fieldName} doit être supérieur ou égal à ${min}.`);
  }

  return numericValue;
};

const parseDateInput = (value, fieldName, { allowNull = false } = {}) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    if (allowNull) {
      return null;
    }

    throw new Error(`${fieldName} est obligatoire.`);
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`${fieldName} est invalide.`);
  }

  return parsedDate;
};

const parseDiscountType = (value, { required = false } = {}) => {
  if (value === undefined) {
    if (required) {
      throw new Error("Le type de remise est obligatoire.");
    }

    return undefined;
  }

  if (!["PERCENTAGE", "FIXED"].includes(value)) {
    throw new Error("Le type de remise doit être PERCENTAGE ou FIXED.");
  }

  return value;
};

const calculateDiscountAmount = (subtotalAmount, promoCode) => {
  const normalizedSubtotal = roundCurrency(subtotalAmount);

  if (!promoCode || normalizedSubtotal <= 0) {
    return 0;
  }

  let discountAmount = 0;

  if (promoCode.discountType === "PERCENTAGE") {
    discountAmount =
      normalizedSubtotal * (Number(promoCode.discountValue || 0) / 100);
  } else {
    discountAmount = Number(promoCode.discountValue || 0);
  }

  return roundCurrency(Math.min(discountAmount, normalizedSubtotal));
};

const buildPricingSummary = (subtotalAmount, promoCode) => {
  const normalizedSubtotal = roundCurrency(subtotalAmount);
  const discountAmount = calculateDiscountAmount(normalizedSubtotal, promoCode);

  return {
    subtotalAmount: normalizedSubtotal,
    discountAmount,
    totalAmount: roundCurrency(normalizedSubtotal - discountAmount),
  };
};

const validatePromoCodeForSubtotal = (
  promoCode,
  subtotalAmount,
  { throwOnInvalid = true } = {}
) => {
  const fail = (message) => {
    if (throwOnInvalid) {
      throw new Error(message);
    }

    return {
      isValid: false,
      message,
      ...buildPricingSummary(subtotalAmount, null),
    };
  };

  if (!promoCode) {
    return fail("Code promo introuvable.");
  }

  const normalizedSubtotal = roundCurrency(subtotalAmount);

  if (normalizedSubtotal <= 0) {
    return fail("Votre panier est vide.");
  }

  if (!promoCode.isActive) {
    return fail("Ce code promo n'est plus actif.");
  }

  if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
    return fail("Ce code promo est expiré.");
  }

  if (
    promoCode.maxUses !== null &&
    promoCode.maxUses !== undefined &&
    promoCode.currentUses >= promoCode.maxUses
  ) {
    return fail("Ce code promo a atteint sa limite d'utilisation.");
  }

  if (
    promoCode.minAmount !== null &&
    promoCode.minAmount !== undefined &&
    normalizedSubtotal < Number(promoCode.minAmount)
  ) {
    return fail(
      `Ce code promo est valable à partir de ${formatCurrency(
        promoCode.minAmount
      )} d'achat.`
    );
  }

  const pricing = buildPricingSummary(normalizedSubtotal, promoCode);

  return {
    isValid: true,
    message: null,
    ...pricing,
  };
};

const sanitizePromoCodeInput = (payload, { isUpdate = false } = {}) => {
  const data = {};

  if (!isUpdate || payload.code !== undefined) {
    const normalizedCode = normalizePromoCode(payload.code);

    if (!normalizedCode) {
      throw new Error("Le code promo est obligatoire.");
    }

    data.code = normalizedCode;
  }

  if (!isUpdate || payload.discountType !== undefined) {
    data.discountType = parseDiscountType(payload.discountType, {
      required: !isUpdate,
    });
  }

  if (!isUpdate || payload.discountValue !== undefined) {
    data.discountValue = parseStrictPositiveMoneyInput(
      payload.discountValue,
      "La valeur de remise"
    );
  }

  if (!isUpdate || payload.minAmount !== undefined) {
    data.minAmount = parseMoneyInput(payload.minAmount, "Le montant minimum", {
      allowNull: true,
    });
  }

  if (!isUpdate || payload.maxUses !== undefined) {
    data.maxUses = parseIntegerInput(payload.maxUses, "Le nombre max d'utilisations", {
      allowNull: true,
      min: 1,
    });
  }

  if (!isUpdate || payload.expiresAt !== undefined) {
    data.expiresAt = parseDateInput(payload.expiresAt, "La date d'expiration", {
      allowNull: true,
    });
  }

  if (!isUpdate || payload.isActive !== undefined) {
    if (payload.isActive === undefined && isUpdate) {
      data.isActive = undefined;
    } else if (typeof payload.isActive !== "boolean") {
      throw new Error("isActive doit être un booléen.");
    } else {
      data.isActive = payload.isActive;
    }
  }

  const discountType = data.discountType ?? payload.discountType;
  const discountValue = data.discountValue ?? Number(payload.discountValue);

  if (discountType === "PERCENTAGE" && discountValue !== undefined && discountValue > 100) {
    throw new Error("Une remise en pourcentage ne peut pas dépasser 100.");
  }

  return data;
};

const getPromoCodes = async () => {
  return prisma.promoCode.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });
};

const getPromoCodeById = async (id) => {
  const promoCode = await prisma.promoCode.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  if (!promoCode) {
    throw new Error("Code promo introuvable.");
  }

  return promoCode;
};

const getPromoCodeByCode = async (code) => {
  const normalizedCode = normalizePromoCode(code);

  if (!normalizedCode) {
    return null;
  }

  return prisma.promoCode.findUnique({
    where: {
      code: normalizedCode,
    },
  });
};

const createPromoCode = async (payload) => {
  const data = sanitizePromoCodeInput(payload);

  return prisma.promoCode.create({
    data,
  });
};

const updatePromoCode = async (id, payload) => {
  const promoCodeId = parseInt(id, 10);

  if (!Number.isInteger(promoCodeId) || promoCodeId <= 0) {
    throw new Error("ID de code promo invalide.");
  }

  await getPromoCodeById(promoCodeId);

  const data = sanitizePromoCodeInput(payload, { isUpdate: true });

  return prisma.promoCode.update({
    where: { id: promoCodeId },
    data,
  });
};

const deletePromoCode = async (id) => {
  const promoCodeId = parseInt(id, 10);

  if (!Number.isInteger(promoCodeId) || promoCodeId <= 0) {
    throw new Error("ID de code promo invalide.");
  }

  await getPromoCodeById(promoCodeId);

  const linkedOrdersCount = await prisma.order.count({
    where: {
      promoCodeId,
    },
  });

  if (linkedOrdersCount > 0) {
    throw new Error(
      "Impossible de supprimer ce code promo car il est déjà lié à une commande."
    );
  }

  return prisma.promoCode.delete({
    where: { id: promoCodeId },
  });
};

module.exports = {
  buildPricingSummary,
  calculateDiscountAmount,
  createPromoCode,
  deletePromoCode,
  getPromoCodeByCode,
  getPromoCodeById,
  getPromoCodes,
  normalizePromoCode,
  roundCurrency,
  updatePromoCode,
  validatePromoCodeForSubtotal,
};
