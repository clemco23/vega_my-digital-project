const express = require("express");
const cors = require("cors");
const newsletterRoutes = require("./routes/newsletter.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));


app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Hapto fonctionne.",
  });
});

app.use("/api/newsletter", newsletterRoutes);

module.exports = app;