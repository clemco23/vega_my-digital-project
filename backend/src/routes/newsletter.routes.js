const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");


const {
  subscribeToNewsletter,
  getAllNewsletterEmails,
} = require("../controllers/newsletter.controller");

const router = express.Router();

router.post("/", subscribeToNewsletter);
router.get("/",authMiddleware, adminMiddleware, getAllNewsletterEmails);

module.exports = router;