const express = require("express");
const cors = require("cors");
const multer = require("multer");
const passport = require("./config/passport");
const session = require("express-session");
const newsletterRoutes = require("./routes/newsletter.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");
const categoryRoutes = require("./routes/category.routes");
const contactRoutes = require("./routes/contact.routes");
const productRoutes = require("./routes/product.routes");
const skillRoutes = require("./routes/skill.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const addressRoutes = require("./routes/address.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const reviewRoutes = require("./routes/review.routes");
const statsRoutes = require("./routes/stats.routes");

const app = express();
const frontendUrl = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).replace(/\/+$/, "");

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.set("json replacer", (_key, value) => (
  typeof value === "bigint" ? value.toString() : value
));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Hapto fonctionne.",
  });
});

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session())

app.use("/api/newsletter", newsletterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/products", productRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/stats", statsRoutes);

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message:
          "Image trop lourde. Reduisez sa taille ou augmentez la limite d'upload du serveur.",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Vous pouvez envoyer jusqu'a 5 images par requete.",
      });
    }
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      message:
        "Contenu trop volumineux. Reduisez la taille du fichier ou augmentez la limite du serveur.",
    });
  }

  if (error?.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Erreur serveur.",
  });
});

module.exports = app;
