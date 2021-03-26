const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth");

// update an article by slug
router.get("/search", async (req, res) => {
  let { q } = req.query;
  let regex = new RegExp(q, "ig");
  let articles = await Article.find({ $text: { $search: q } });
  res.status(200).send({data: articles});
});

module.exports = router;
