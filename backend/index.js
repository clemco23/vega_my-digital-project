require("dotenv").config();
console.log("GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET existe =", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_CALLBACK_URL =", process.env.GOOGLE_CALLBACK_URL);


const app = require("./src/app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(` trop bien le serveur est lancer sur le port ${port}`);
});