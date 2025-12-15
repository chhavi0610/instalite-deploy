const express = require("express");
const db = require("../db");
const checkAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", checkAuth, (req, res) => {
  const { image_url, caption } = req.body;
  const userId = req.userId;

  if (!image_url || !caption) {
    return res.status(400).json({ message: "All fields required" });
  }

  const post =  "INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)";

  db.query(post, [userId, image_url, caption], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Post not created" });
    }

    res.json({ message: "Post created successfully" });
  });
});
router.post("/:id/like", checkAuth, (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;

  const like = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";

  db.query(like, [userId, postId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Already liked or error" });
    }

    res.json({ message: "Post liked" });
  });
});
router.delete("/:id/unlike", checkAuth, (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;

  const unlike = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";

  db.query(unlike, [userId, postId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error unliking post" });
    }

    res.json({ message: "Post unliked" });
  });
});
router.post("/:id/comment", checkAuth, (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;
  const { comment_text } = req.body;

  if (!comment_text) {
    return res.status(400).json({ message: "Comment required" });
  }

  const comment= "INSERT INTO comments (user_id, post_id, comment_text) VALUES (?, ?, ?)";

  db.query(comment, [userId, postId, comment_text], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding comment" });
    }

    res.json({ message: "Comment added" });
  });
});

router.get("/:id/comments", checkAuth, (req, res) => {
  const postId = req.params.id;

  const sql= " SELECT c.comment_text, c.created_at, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC";

  db.query(sql, [postId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching comments" });
    }
    res.json(result);
  });
});

module.exports = router;
