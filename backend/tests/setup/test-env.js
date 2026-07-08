const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../../.env.test");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
