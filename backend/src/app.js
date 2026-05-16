const express = require("express");
const cors = require("cors");
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

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.set("json replacer", (_key, value) => (
  typeof value === "bigint" ? value.toString() : value
));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Hapto fonctionne.",
  });
});

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

module.exports = app;
