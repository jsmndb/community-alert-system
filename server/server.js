const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Community Alert API is running");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(
      sql,
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Registration failed",
          });
        }

        res.json({
          message: "User registered successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Server error",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
});

app.post(
  "/posts",
  upload.single("image"),
  (req, res) => {
    const {
      user_id,
      title,
      description,
      category,
    } = req.body;

    const image = req.file
      ? req.file.filename
      : null;

    const sql = `
      INSERT INTO posts
      (user_id, title, description, category, image)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        user_id,
        title,
        description,
        category,
        image,
      ],
      (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Failed to create post",
          });
        }

        res.json({
          message: "Post created successfully",
        });
      }
    );
  }
);

app.post("/likes", (req, res) => {
  const { post_id, user_id } = req.body;

  const sql =
    "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";

  db.query(sql, [post_id, user_id], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to like post",
      });
    }

    res.json({
      message: "Post liked",
    });
  });
});

app.get("/posts", (req, res) => {
  const sql = `
    SELECT
      posts.*,
      users.name
    FROM posts
    JOIN users
      ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch posts",
      });
    }

    res.json(result);
  });
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      posts.*,
      users.name
    FROM posts
    JOIN users
      ON posts.user_id = users.id
    WHERE posts.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result[0]);
  });
});

app.get("/posts/:id/likes", (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT COUNT(*) AS totalLikes FROM likes WHERE post_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result[0]);
  });
});

app.delete("/likes", (req, res) => {
  const { post_id, user_id } = req.body;

  const sql =
    "DELETE FROM likes WHERE post_id = ? AND user_id = ?";

  db.query(sql, [post_id, user_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Like removed",
    });
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});