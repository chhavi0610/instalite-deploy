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

 try {
    const email = req.body.email;
    const password = req.body.password;

    if (email === 'c@g.com' && password === '123') {
      const token = jwt.sign(
        { id: 0, email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        message: 'Test login success',
        token,
        user: {
          id: 0,
          email,
          username: 'Test User'
        }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
});


module.exports = router;
