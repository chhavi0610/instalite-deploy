const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const signup =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    db.query(signup, [username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) =>{

      const { email, password } = req.body;
        const login = "SELECT * FROM users WHERE email = ?";
        db.query(login, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Login error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      "secret",
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});


module.exports = router;