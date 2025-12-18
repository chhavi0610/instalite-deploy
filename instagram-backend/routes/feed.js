const express = require("express");
const db = require("../db");
const checkAuth = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM posts');

    return res.status(200).json(rows);
  } catch (err) {
    console.error('FEED DB ERROR:', err);
    return res.status(500).json({ message: 'Error fetching feed' });
  }
});



module.exports = router;
