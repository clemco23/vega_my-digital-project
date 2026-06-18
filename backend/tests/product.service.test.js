import { describe, expect, it, vi } from "vitest";
import {
  addProductImages,
  addSetItem,
  createProduct,
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  updateProduct,
  updateVariant,
} from "../src/services/product.service.js";

describe("Product service", () => {
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
});
