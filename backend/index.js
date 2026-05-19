require("dotenv").config();
console.log("DATABASE_URL utilisée =", process.env.DATABASE_URL);

const app = require("./src/app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(` trop bien le serveur est lancer sur le port ${port}`);
});