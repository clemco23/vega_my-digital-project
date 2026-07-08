import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  $transaction: vi.fn(),
  product: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  productVariant: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  productImage: {
    findFirst: vi.fn(),
    createMany: vi.fn(),
    delete: vi.fn(),
  },
  productSkill: {
    create: vi.fn(),
  },
  setItem: {
    create: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  order: {
    findMany: vi.fn(),
  },
  orderVariant: {
    findFirst: vi.fn(),
    deleteMany: vi.fn(),
  },
  wishlist: {
    findMany: vi.fn(),
    update: vi.fn(),
  },
};

const recalculateOrderPricing = vi.fn();

vi.mock("../src/config/prisma.js", () => prismaMock);
vi.mock("../src/services/order.service.js", () => ({
  recalculateOrderPricing,
}));

import {
  addProductImages,
  addSetItem,
  addSkillToProduct,
  addVariant,
  createProduct,
  deleteProduct,
  deleteProductImage,
  deleteSetItem,
  deleteVariant,
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  getProductsBySkill,
  getProductsByType,
  updateProduct,
  updateVariant,
} from "../src/services/product.service.js";

describe("Product service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("recupere les produits actifs avec leurs relations", async () => {
    const client = {
      product: {
        findMany: vi.fn().mockResolvedValue([{ id: 1, name: "Board" }]),
      },
    };

    const res = await getAllProducts(client);

    expect(res).toEqual([{ id: 1, name: "Board" }]);
    expect(client.product.findMany).toHaveBeenCalledWith({
      where: { isActivated: true },
      include: {
        variants: true,
        images: true,
        skills: {
          include: { skill: true },
        },
      },
    });
  });

  it("recupere les produits admin", async () => {
    const client = {
      product: {
        findMany: vi.fn().mockResolvedValue([{ id: 2, name: "Module" }]),
      },
    };

    const res = await getAllProductsAdmin(client);

    expect(res).toEqual([{ id: 2, name: "Module" }]);
    expect(client.product.findMany).toHaveBeenCalledWith({
      include: {
        variants: true,
        images: true,
        skills: {
          include: { skill: true },
        },
      },
    });
  });

  it("recupere un produit par id avec ses relations imbriquees", async () => {
    const client = {
      product: {
        findUnique: vi.fn().mockResolvedValue({ id: 7, name: "Pack" }),
      },
    };

    const res = await getProductById("7", client);

    expect(res).toEqual({ id: 7, name: "Pack" });
    expect(client.product.findUnique).toHaveBeenCalledWith({
      where: { id: 7 },
      include: {
        variants: {
          include: {
            setVariantItems: {
              include: {
                productVariant: {
                  include: {
                    product: {
                      include: {
                        images: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        images: true,
        skills: {
          include: { skill: true },
        },
      },
    });
  });

  it("cree un produit avec normalisation des variantes et des skills", async () => {
    const client = {
      product: {
        create: vi.fn().mockResolvedValue({ id: 3 }),
      },
    };

    const res = await createProduct(
      {
        name: "Pack decouverte",
        description: "Desc",
        productType: "SET_PREDEFINED",
        ageMin: "2",
        ageMax: "6",
        variants: [
          {
            size: "M",
            price: "19.99",
            stock: "5",
            holesCount: "4",
            holesRequired: "2",
          },
        ],
        skillIds: ["1", "2"],
      },
      client
    );

    expect(res).toEqual({ id: 3 });
    expect(client.product.create).toHaveBeenCalledWith({
      data: {
        name: "Pack decouverte",
        description: "Desc",
        productType: "SET_PREDEFINED",
        ageMin: 2,
        ageMax: 6,
        variants: {
          create: [
            {
              size: "M",
              price: 19.99,
              stock: 5,
              holesCount: 4,
              holesRequired: 2,
            },
          ],
        },
        skills: {
          create: [
            { skill: { connect: { id: 1 } } },
            { skill: { connect: { id: 2 } } },
          ],
        },
      },
      include: {
        variants: true,
        skills: { include: { skill: true } },
      },
    });
  });

  it("cree un produit sans skills", async () => {
    const client = {
      product: {
        create: vi.fn().mockResolvedValue({ id: 4 }),
      },
    };

    const res = await createProduct(
      {
        name: "Board",
        description: "Desc",
        productType: "BOARD",
        ageMin: "3",
        ageMax: "8",
        variants: [{ size: "S", price: "10", stock: "2" }],
      },
      client
    );

    expect(res).toEqual({ id: 4 });
    expect(client.product.create).toHaveBeenCalledWith({
      data: {
        name: "Board",
        description: "Desc",
        productType: "BOARD",
        ageMin: 3,
        ageMax: 8,
        variants: {
          create: [
            {
              size: "S",
              price: 10,
              stock: 2,
              holesCount: null,
              holesRequired: null,
            },
          ],
        },
        skills: undefined,
      },
      include: {
        variants: true,
        skills: { include: { skill: true } },
      },
    });
  });

  it("met a jour un produit", async () => {
    const client = {
      product: {
        update: vi.fn().mockResolvedValue({ id: 12, name: "Nouveau nom" }),
      },
    };

    const res = await updateProduct("12", { name: "Nouveau nom" }, client);

    expect(res).toEqual({ id: 12, name: "Nouveau nom" });
    expect(client.product.update).toHaveBeenCalledWith({
      where: { id: 12 },
      data: { name: "Nouveau nom" },
      include: {
        variants: true,
        images: true,
      },
    });
  });

  it("met a jour une variante avec normalisation numerique", async () => {
    const client = {
      productVariant: {
        update: vi.fn().mockResolvedValue({ id: 5 }),
      },
    };

    const res = await updateVariant(
      "5",
      {
        price: "14.4",
        stock: "8",
        holesCount: "6",
        holesRequired: "3",
      },
      client
    );

    expect(res).toEqual({ id: 5 });
    expect(client.productVariant.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: {
        price: 14.4,
        stock: 8,
        holesCount: 6,
        holesRequired: 3,
      },
    });
  });

  it("met a jour une variante sans champs optionnels", async () => {
    const client = {
      productVariant: {
        update: vi.fn().mockResolvedValue({ id: 6 }),
      },
    };

    const res = await updateVariant("6", {}, client);

    expect(res).toEqual({ id: 6 });
    expect(client.productVariant.update).toHaveBeenCalledWith({
      where: { id: 6 },
      data: {
        price: undefined,
        stock: undefined,
        holesCount: undefined,
        holesRequired: undefined,
      },
    });
  });

  it("ajoute des images avec un positionnement initial", async () => {
    const client = {
      productImage: {
        findFirst: vi.fn().mockResolvedValue(null),
        createMany: vi.fn().mockResolvedValue({ count: 2 }),
      },
    };

    const res = await addProductImages(
      "9",
      ["https://img/1.jpg", "https://img/2.jpg"],
      client
    );

    expect(res).toEqual({ count: 2 });
    expect(client.productImage.createMany).toHaveBeenCalledWith({
      data: [
        { productId: 9, url: "https://img/1.jpg", position: 1 },
        { productId: 9, url: "https://img/2.jpg", position: 2 },
      ],
    });
  });

  it("ajoute des images a la suite des positions existantes", async () => {
    const client = {
      productImage: {
        findFirst: vi.fn().mockResolvedValue({ id: 1, position: 4 }),
        createMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };

    const res = await addProductImages("6", ["https://img/3.jpg"], client);

    expect(res).toEqual({ count: 1 });
    expect(client.productImage.createMany).toHaveBeenCalledWith({
      data: [{ productId: 6, url: "https://img/3.jpg", position: 5 }],
    });
  });

  it("supprime une image produit", async () => {
    const client = {
      productImage: {
        delete: vi.fn().mockResolvedValue({ id: 8 }),
      },
    };

    const res = await deleteProductImage("8", client);

    expect(res).toEqual({ id: 8 });
    expect(client.productImage.delete).toHaveBeenCalledWith({
      where: { id: 8 },
    });
  });

  it("supprime un produit sans variantes associees", async () => {
    const tx = {
      product: {
        findUnique: vi.fn().mockResolvedValue({ id: 10, variants: [] }),
        delete: vi.fn().mockResolvedValue({ id: 10 }),
      },
    };
    const client = {
      $transaction: vi.fn().mockImplementation((callback) => callback(tx)),
    };

    const res = await deleteProduct("10", client);

    expect(res).toEqual({ id: 10 });
    expect(tx.product.findUnique).toHaveBeenCalledWith({
      where: { id: 10 },
      include: {
        variants: {
          select: { id: true },
        },
      },
    });
    expect(tx.product.delete).toHaveBeenCalledWith({
      where: { id: 10 },
    });
  });

  it("rejette la suppression d'un produit introuvable", async () => {
    const tx = {
      product: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };
    const client = {
      $transaction: vi.fn().mockImplementation((callback) => callback(tx)),
    };

    await expect(deleteProduct("11", client)).rejects.toMatchObject({
      message: "Produit introuvable.",
      statusCode: 404,
    });
  });

  it("supprime un produit et nettoie les relations associees", async () => {
    const tx = {
      product: {
        findUnique: vi.fn().mockResolvedValue({
          id: 12,
          variants: [{ id: 21 }, { id: 22 }],
        }),
        delete: vi.fn().mockResolvedValue({ id: 12 }),
      },
      orderVariant: {
        findFirst: vi.fn().mockResolvedValue(null),
        deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
      },
      order: {
        findMany: vi
          .fn()
          .mockResolvedValueOnce([{ id: 200 }, { id: 201 }])
          .mockResolvedValueOnce([{ id: 200 }]),
      },
      wishlist: {
        findMany: vi.fn().mockResolvedValue([{ id: 300 }]),
        update: vi.fn().mockResolvedValue({ id: 300 }),
      },
      setItem: {
        deleteMany: vi.fn().mockResolvedValue({ count: 3 }),
      },
    };
    const client = {
      $transaction: vi.fn().mockImplementation((callback) => callback(tx)),
    };
    recalculateOrderPricing.mockResolvedValue();

    const res = await deleteProduct("12", client, {
      recalculatePricing: recalculateOrderPricing,
    });

    expect(res).toEqual({ id: 12 });
    expect(tx.orderVariant.findFirst).toHaveBeenCalled();
    expect(tx.orderVariant.deleteMany).toHaveBeenCalledWith({
      where: {
        orderId: { in: [200, 201] },
        productVariantId: { in: [21, 22] },
      },
    });
    expect(recalculateOrderPricing).toHaveBeenCalledWith(tx, 200, {
      removeInvalidPromo: true,
    });
    expect(tx.wishlist.update).toHaveBeenCalledWith({
      where: { id: 300 },
      data: {
        variants: {
          disconnect: [{ id: 21 }, { id: 22 }],
        },
      },
    });
    expect(tx.setItem.deleteMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { setVariantId: { in: [21, 22] } },
          { productVariantId: { in: [21, 22] } },
        ],
      },
    });
  });

  it("rejette un set item si la variante est introuvable", async () => {
    const client = {
      productVariant: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
      setItem: {
        create: vi.fn(),
      },
    };

    await expect(addSetItem("2", "8", "1", client)).rejects.toThrow(
      "Variante introuvable."
    );
  });

  it("rejette un set item si la variante ne correspond pas a un set predefini", async () => {
    const client = {
      productVariant: {
        findUnique: vi.fn().mockResolvedValue({
          id: 2,
          product: { productType: "BOARD" },
        }),
      },
      setItem: {
        create: vi.fn(),
      },
    };

    await expect(addSetItem("2", "8", "1", client)).rejects.toThrow(
      "Cette variante n'appartient pas à un set prédéfini."
    );
  });

  it("cree un set item pour une variante de set predefini", async () => {
    const client = {
      productVariant: {
        findUnique: vi.fn().mockResolvedValue({
          id: 2,
          product: { productType: "SET_PREDEFINED" },
        }),
      },
      setItem: {
        create: vi.fn().mockResolvedValue({ id: 90 }),
      },
    };

    const res = await addSetItem("2", "8", "3", client);

    expect(res).toEqual({ id: 90 });
    expect(client.setItem.create).toHaveBeenCalledWith({
      data: {
        setVariantId: 2,
        productVariantId: 8,
        quantity: 3,
      },
    });
  });

  it("supprime un set item", async () => {
    const client = {
      setItem: {
        delete: vi.fn().mockResolvedValue({ id: 13 }),
      },
    };

    const res = await deleteSetItem("13", client);

    expect(res).toEqual({ id: 13 });
    expect(client.setItem.delete).toHaveBeenCalledWith({
      where: { id: 13 },
    });
  });

  it("rejette la suppression d'une variante introuvable", async () => {
    const tx = {
      productVariant: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };
    const client = {
      $transaction: vi.fn().mockImplementation((callback) => callback(tx)),
    };

    await expect(deleteVariant("18", client)).rejects.toMatchObject({
      message: "Variante introuvable.",
      statusCode: 404,
    });
  });

  it("rejette la suppression d'une variante deja utilisee dans une commande", async () => {
    const tx = {
      productVariant: {
        findUnique: vi.fn().mockResolvedValue({ id: 18 }),
      },
      orderVariant: {
        findFirst: vi.fn().mockResolvedValue({
          order: { id: 501, orderStatus: "PAID" },
          productVariant: {
            product: { name: "Planche premium" },
          },
        }),
      },
    };
    const client = {
      $transaction: vi.fn().mockImplementation((callback) => callback(tx)),
    };

    await expect(deleteVariant("18", client)).rejects.toMatchObject({
      message:
        "Impossible de supprimer cette variante car elle est déjà utilisée dans la commande #501.",
      statusCode: 409,
    });
  });

  it("supprime une variante et nettoie ses relations", async () => {
    const tx = {
      productVariant: {
        findUnique: vi.fn().mockResolvedValue({ id: 19 }),
        delete: vi.fn().mockResolvedValue({ id: 19 }),
      },
      orderVariant: {
        findFirst: vi.fn().mockResolvedValue(null),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      },
      order: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      wishlist: {
        findMany: vi.fn().mockResolvedValue([]),
        update: vi.fn(),
      },
      setItem: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const client = {
      $transaction: vi.fn().mockImplementation((callback) => callback(tx)),
    };

    const res = await deleteVariant("19", client);

    expect(res).toEqual({ id: 19 });
    expect(tx.orderVariant.deleteMany).not.toHaveBeenCalled();
    expect(recalculateOrderPricing).not.toHaveBeenCalled();
    expect(tx.setItem.deleteMany).toHaveBeenCalledWith({
      where: {
        OR: [{ setVariantId: { in: [19] } }, { productVariantId: { in: [19] } }],
      },
    });
    expect(tx.productVariant.delete).toHaveBeenCalledWith({
      where: { id: 19 },
    });
  });

  it("filtre les produits par type", async () => {
    const client = {
      product: {
        findMany: vi.fn().mockResolvedValue([{ id: 30 }]),
      },
    };

    const res = await getProductsByType("MODULE", client);

    expect(res).toEqual([{ id: 30 }]);
    expect(client.product.findMany).toHaveBeenCalledWith({
      where: { productType: "MODULE", isActivated: true },
      include: {
        variants: true,
        images: true,
        skills: { include: { skill: true } },
      },
    });
  });

  it("filtre les produits par skill", async () => {
    const client = {
      product: {
        findMany: vi.fn().mockResolvedValue([{ id: 31 }]),
      },
    };

    const res = await getProductsBySkill("7", client);

    expect(res).toEqual([{ id: 31 }]);
    expect(client.product.findMany).toHaveBeenCalledWith({
      where: {
        isActivated: true,
        skills: {
          some: { skillId: 7 },
        },
      },
      include: {
        variants: true,
        images: true,
        skills: { include: { skill: true } },
      },
    });
  });

  it("cree une variante produit", async () => {
    const client = {
      productVariant: {
        create: vi.fn().mockResolvedValue({ id: 41 }),
      },
    };

    const res = await addVariant("5", {
      size: "L",
      price: "29.99",
      stock: "4",
      holesCount: "8",
      holesRequired: "3",
    }, client);

    expect(res).toEqual({ id: 41 });
    expect(client.productVariant.create).toHaveBeenCalledWith({
      data: {
        productId: 5,
        size: "L",
        price: 29.99,
        stock: 4,
        holesCount: 8,
        holesRequired: 3,
      },
    });
  });

  it("cree une variante produit sans champs optionnels", async () => {
    const client = {
      productVariant: {
        create: vi.fn().mockResolvedValue({ id: 42 }),
      },
    };

    const res = await addVariant(
      "6",
      {
        size: "S",
        price: "15",
        stock: "2",
      },
      client
    );

    expect(res).toEqual({ id: 42 });
    expect(client.productVariant.create).toHaveBeenCalledWith({
      data: {
        productId: 6,
        size: "S",
        price: 15,
        stock: 2,
        holesCount: null,
        holesRequired: null,
      },
    });
  });

  it("cree une liaison entre produit et skill", async () => {
    const client = {
      productSkill: {
        create: vi.fn().mockResolvedValue({ productId: 9, skillId: 4 }),
      },
    };

    const res = await addSkillToProduct("9", "4", client);

    expect(res).toEqual({ productId: 9, skillId: 4 });
    expect(client.productSkill.create).toHaveBeenCalledWith({
      data: {
        productId: 9,
        skillId: 4,
      },
    });
  });
});
