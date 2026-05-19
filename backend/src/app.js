const express = require("express");
const cors = require("cors");
// const passport = require("./config/passport");
// const session = require("express-session");
const newsletterRoutes = require("./routes/newsletter.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");
const categoryRoutes = require("./routes/category.routes");
const contactRoutes = require("./routes/contact.routes");
const productRoutes = require("./routes/product.routes");
const skillRoutes = require("./routes/skill.routes");
const cartRoutes = require("./routes/cart.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const addressRoutes = require("./routes/address.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const reviewRoutes = require("./routes/review.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

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

// app.use(session({
//   secret: process.env.JWT_SECRET,
//   resave: false,
//   saveUninitialized: false,
// }));

// app.use(passport.initialize());
// app.use(passport.session())

app.use("/api/newsletter", newsletterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/products", productRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);


module.exports = app;
