const express = require("express");
const db = require("../db");
const checkAuth = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/:id", checkAuth, (req, res) => {
  const followerId = req.userId;
  const followingId = req.params.id;

  if (followerId == followingId) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }

  const follow=
    "INSERT INTO followers (follower_id, following_id) VALUES (?, ?)";

  db.query(follow, [followerId, followingId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Already following or error" });
    }

    res.json({ message: "User followed successfully" });
  });
});


router.delete("/:id", checkAuth, (req, res) => {
  const followerId = req.userId;
  const followingId = req.params.id;

  const deleteFollower =
    "DELETE FROM followers WHERE follower_id = ? AND following_id = ?";

  db.query(deleteFollower, [followerId, followingId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error unfollowing user" });
    }

    res.json({ message: "User unfollowed successfully" });
  });
});

module.exports = router;
