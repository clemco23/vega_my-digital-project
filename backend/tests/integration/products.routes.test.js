import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

const hasTestDatabase = Boolean(process.env.TEST_DATABASE_URL);

describe.skipIf(!hasTestDatabase)("Products routes integration", () => {
  let app;
  let prisma;

  beforeAll(async () => {
    const appModule = await import("../../src/app.js");
    const prismaModule = await import("../../src/config/prisma.js");

    app = appModule.default || appModule;
    prisma = prismaModule.default || prismaModule;

    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.skill.deleteMany();
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.product.deleteMany();
      await prisma.skill.deleteMany();
      await prisma.$disconnect();
    }
  });

  it("retourne uniquement les produits actifs du type demande", async () => {
    const coordination = await prisma.skill.create({
      data: {
        label: `Coordination-${Date.now()}`,
      },
    });

    await prisma.product.create({
      data: {
        name: "Board active",
        description: "Produit visible",
        productType: "BOARD",
        ageMin: 3,
        ageMax: 8,
        isActivated: true,
        variants: {
          create: [
            {
              size: "M",
              price: "99.90",
              stock: 5,
              holesCount: 8,
              holesRequired: 4,
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://example.com/board-active.jpg",
              position: 1,
            },
          ],
        },
        skills: {
          create: [
            {
              skill: {
                connect: {
                  id: coordination.id,
                },
              },
            },
          ],
        },
      },
    });

    await prisma.product.create({
      data: {
        name: "Board inactive",
        productType: "BOARD",
        ageMin: 3,
        ageMax: 8,
        isActivated: false,
        variants: {
          create: [
            {
              size: "S",
              price: "79.90",
              stock: 3,
            },
          ],
        },
      },
    });

    await prisma.product.create({
      data: {
        name: "Module active",
        productType: "MODULE",
        ageMin: 4,
        ageMax: 9,
        isActivated: true,
        variants: {
          create: [
            {
              size: "L",
              price: "49.90",
              stock: 8,
            },
          ],
        },
      },
    });

    const response = await request(app).get("/api/products/type/BOARD");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      name: "Board active",
      productType: "BOARD",
      isActivated: true,
    });
    expect(response.body.data[0].variants).toHaveLength(1);
    expect(response.body.data[0].images).toHaveLength(1);
    expect(response.body.data[0].skills).toHaveLength(1);
    expect(response.body.data[0].skills[0].skill.label).toBe(coordination.label);
  });

  it("retourne une erreur 400 si le type demande est invalide", async () => {
    const response = await request(app).get("/api/products/type/INVALID");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Type invalide.",
    });
  });
});
