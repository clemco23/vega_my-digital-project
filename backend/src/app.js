const express = require("express");
const newsletterRoutes = require("./routes/newsletter.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Hapto fonctionne.",
  });
});

app.use("/api/newsletter", newsletterRoutes);

module.exports = app;