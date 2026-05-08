const express = require("express");

const {
  subscribeToNewsletter,
  getAllNewsletterEmails,
} = require("../controllers/newsletter.controller");

const router = express.Router();

router.post("/", subscribeToNewsletter);
router.get("/", getAllNewsletterEmails);

module.exports = router;