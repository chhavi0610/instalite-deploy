const express = require("express");
const db = require("../db");
const checkAuth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  const userId = req.userId;
const feed = "SELECT posts.id,posts.image_url,posts.caption,posts.created_at,users.username FROM posts JOIN followers ON posts.user_id = followers.following_id JOIN users ON users.id = posts.user_id WHERE followers.follower_id = ? ORDER BY posts.created_at DESC";
db.query(feed, [userId], (err, result) => {
if (err) {
console.log("FEED SQL ERROR:", err);
      return res.status(500).json({ message: "Error fetching feed" });}
    res.json(result);
  });
});

module.exports = router;
