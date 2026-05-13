const express = require("express");
const cors = require("cors");
const newsletterRoutes = require("./routes/newsletter.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");
const categoryRoutes = require("./routes/category.routes");
const contactRoutes = require("./routes/contact.routes");

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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contacts", contactRoutes);

module.exports = app;