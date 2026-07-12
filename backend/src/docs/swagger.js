const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const routeFiles = path.resolve(__dirname, "../routes/*.js").replace(/\\/g, "/");

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hapto API",
      version: "1.0.0",
      description: "Interactive documentation for the Hapto backend API.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "User authentication and account lifecycle endpoints.",
      },
      {
        name: "Products",
        description: "Product catalog and admin product management endpoints.",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        MessageResponse: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              example: "Operation completed successfully.",
            },
          },
        },
        UserRole: {
          type: "string",
          enum: ["USER", "ADMIN"],
          example: "USER",
        },
        User: {
          type: "object",
          required: ["id", "name", "firstname", "email", "role", "avatar"],
          properties: {
            id: {
              type: "string",
              example: "1",
            },
            name: {
              type: "string",
              example: "Dupont",
            },
            firstname: {
              type: "string",
              example: "Alice",
            },
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            role: {
              $ref: "#/components/schemas/UserRole",
            },
            avatar: {
              type: "string",
              nullable: true,
              example: null,
            },
          },
        },
        AuthRegisterRequest: {
          type: "object",
          required: ["name", "firstname", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Dupont",
            },
            firstname: {
              type: "string",
              example: "Alice",
            },
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "password123",
            },
          },
        },
        AuthRegisterResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: {
              type: "string",
              example: "Inscription reussie. Verifiez votre email.",
            },
            data: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        AuthLoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },
        AuthLoginResponse: {
          type: "object",
          required: ["message", "token", "data"],
          properties: {
            message: {
              type: "string",
              example: "Connexion reussie.",
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            },
            data: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        CurrentUserResponse: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        AuthVerifyRequest: {
          type: "object",
          required: ["email", "token"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            token: {
              type: "string",
              example: "123456",
            },
          },
        },
        AuthEmailRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
          },
        },
        AuthResetPasswordRequest: {
          type: "object",
          required: ["email", "token", "newPassword"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            token: {
              type: "string",
              example: "reset-token-123",
            },
            newPassword: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "newPassword123",
            },
          },
        },
        ProductType: {
          type: "string",
          enum: ["BOARD", "MODULE", "SET_PREDEFINED"],
          example: "BOARD",
        },
        Size: {
          type: "string",
          enum: ["S", "M", "L"],
          example: "M",
        },
        Skill: {
          type: "object",
          required: ["id", "label"],
          properties: {
            id: {
              type: "integer",
              example: 2,
            },
            label: {
              type: "string",
              example: "Coordination",
            },
          },
        },
        ProductSkill: {
          type: "object",
          required: ["productId", "skillId", "skill"],
          properties: {
            productId: {
              type: "integer",
              example: 1,
            },
            skillId: {
              type: "integer",
              example: 2,
            },
            skill: {
              $ref: "#/components/schemas/Skill",
            },
          },
        },
        ProductImage: {
          type: "object",
          required: ["id", "productId", "url", "position"],
          properties: {
            id: {
              type: "integer",
              example: 10,
            },
            productId: {
              type: "integer",
              example: 1,
            },
            url: {
              type: "string",
              format: "uri",
              example: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            },
            position: {
              type: "integer",
              example: 1,
            },
          },
        },
        SetItem: {
          type: "object",
          required: ["id", "setVariantId", "productVariantId", "quantity"],
          properties: {
            id: {
              type: "integer",
              example: 5,
            },
            setVariantId: {
              type: "integer",
              example: 8,
            },
            productVariantId: {
              type: "integer",
              example: 14,
            },
            quantity: {
              type: "integer",
              example: 2,
            },
          },
        },
        ProductVariant: {
          type: "object",
          required: ["id", "productId", "size", "price", "stock"],
          properties: {
            id: {
              type: "integer",
              example: 8,
            },
            productId: {
              type: "integer",
              example: 1,
            },
            size: {
              $ref: "#/components/schemas/Size",
            },
            price: {
              type: "string",
              example: "89.90",
            },
            stock: {
              type: "integer",
              example: 12,
            },
            holesCount: {
              type: "integer",
              nullable: true,
              example: 10,
            },
            holesRequired: {
              type: "integer",
              nullable: true,
              example: 8,
            },
            setVariantItems: {
              type: "array",
              items: {
                $ref: "#/components/schemas/SetItem",
              },
            },
          },
        },
        Product: {
          type: "object",
          required: [
            "id",
            "name",
            "productType",
            "ageMin",
            "ageMax",
            "isActivated",
            "variants",
            "images",
            "skills",
          ],
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Board Sensoriel",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Planche educative pour enfants.",
            },
            productType: {
              $ref: "#/components/schemas/ProductType",
            },
            ageMin: {
              type: "integer",
              example: 3,
            },
            ageMax: {
              type: "integer",
              example: 8,
            },
            isActivated: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            variants: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ProductVariant",
              },
            },
            images: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ProductImage",
              },
            },
            skills: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ProductSkill",
              },
            },
          },
        },
        ProductListResponse: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        ProductResponse: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              $ref: "#/components/schemas/Product",
            },
          },
        },
        ProductVariantInput: {
          type: "object",
          required: ["size", "price", "stock"],
          properties: {
            size: {
              $ref: "#/components/schemas/Size",
            },
            price: {
              type: "number",
              format: "float",
              example: 89.9,
            },
            stock: {
              type: "integer",
              example: 12,
            },
            holesCount: {
              type: "integer",
              nullable: true,
              example: 10,
            },
            holesRequired: {
              type: "integer",
              nullable: true,
              example: 8,
            },
          },
        },
        CreateProductRequest: {
          type: "object",
          required: ["name", "productType", "ageMin", "ageMax", "variants"],
          properties: {
            name: {
              type: "string",
              example: "Board Sensoriel",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Planche evolutive en bois.",
            },
            productType: {
              $ref: "#/components/schemas/ProductType",
            },
            ageMin: {
              type: "integer",
              example: 3,
            },
            ageMax: {
              type: "integer",
              example: 8,
            },
            variants: {
              type: "array",
              minItems: 1,
              items: {
                $ref: "#/components/schemas/ProductVariantInput",
              },
            },
            skillIds: {
              type: "array",
              items: {
                type: "integer",
              },
              example: [1, 2],
            },
          },
        },
        UpdateProductRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Board Sensoriel Premium",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Version mise a jour du produit.",
            },
            productType: {
              $ref: "#/components/schemas/ProductType",
            },
            ageMin: {
              type: "integer",
              example: 4,
            },
            ageMax: {
              type: "integer",
              example: 10,
            },
            isActivated: {
              type: "boolean",
              example: true,
            },
          },
        },
        AddVariantRequest: {
          allOf: [
            {
              $ref: "#/components/schemas/ProductVariantInput",
            },
          ],
        },
        UpdateVariantRequest: {
          type: "object",
          properties: {
            price: {
              type: "number",
              format: "float",
              example: 99.9,
            },
            stock: {
              type: "integer",
              example: 8,
            },
            holesCount: {
              type: "integer",
              nullable: true,
              example: 12,
            },
            holesRequired: {
              type: "integer",
              nullable: true,
              example: 10,
            },
          },
        },
        AddSetItemRequest: {
          type: "object",
          required: ["productVariantId", "quantity"],
          properties: {
            productVariantId: {
              type: "integer",
              example: 14,
            },
            quantity: {
              type: "integer",
              example: 2,
            },
          },
        },
      },
    },
  },
  apis: [
    routeFiles,
  ],
};

module.exports = swaggerJsdoc(options);
