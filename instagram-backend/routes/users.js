const express = require("express");
const db = require("../db");
const checkAuth = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET ALL USERS (EXCEPT LOGGED-IN USER)
  + isFollowing flag
*/
router.get("/", checkAuth, (req, res) => {
  const userId = req.userId;

  const query = `
    SELECT 
      u.id,
      u.username,
      CASE 
        WHEN f.follower_id IS NOT NULL THEN true
        ELSE false
      END AS isFollowing
    FROM users u
    LEFT JOIN followers f
      ON u.id = f.following_id
      AND f.follower_id = ?
    WHERE u.id != ?
  `;

  db.query(query, [userId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching users" });
    }

    res.json(result);
  });
});

/*
  GET LOGGED-IN USER PROFILE DETAILS
*/
router.get("/me", checkAuth, (req, res) => {
  const userId = req.userId;

  const userQuery =
    "SELECT username, email FROM users WHERE id = ?";
  const followersQuery =
    "SELECT COUNT(*) AS followers FROM followers WHERE following_id = ?";
  const followingQuery =
    "SELECT COUNT(*) AS following FROM followers WHERE follower_id = ?";
  const postsQuery =
    "SELECT COUNT(*) AS posts FROM posts WHERE user_id = ?";

  db.query(userQuery, [userId], (err, userResult) => {
    if (err) return res.status(500).json({ message: "Error fetching profile" });

    db.query(followersQuery, [userId], (err, followersResult) => {
      if (err) return res.status(500).json({ message: "Error fetching followers" });

      db.query(followingQuery, [userId], (err, followingResult) => {
        if (err) return res.status(500).json({ message: "Error fetching following" });

        db.query(postsQuery, [userId], (err, postsResult) => {
          if (err) return res.status(500).json({ message: "Error fetching posts" });

          res.json({
            username: userResult[0].username,
            email: userResult[0].email,
            followers: followersResult[0].followers,
            following: followingResult[0].following,
            posts: postsResult[0].posts
          });
        });
      });
    });
  });
});

module.exports = router;
