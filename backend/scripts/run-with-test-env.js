const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../.env.test");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

const [, , command, ...args] = process.argv;

if (!command) {
  console.error("Commande manquante.");
  process.exit(1);
}

const child = spawn(command, args, {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

