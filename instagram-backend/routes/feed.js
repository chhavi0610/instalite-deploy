const express = require("express");
const db = require("../db");
const checkAuth = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT * FROM posts
      ORDER BY created_at DESC
    `);

    return res.status(200).json(posts);
  } catch (err) {
    console.error('FEED ERROR:', err);
    return res.status(500).json({ message: 'Error fetching feed' });
  }
});


module.exports = router;
