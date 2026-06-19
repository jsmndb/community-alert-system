const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Multer Configuration
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

const upload = multer({ storage });

// =====================================
// BASIC ROUTE
// =====================================

app.get("/", (req, res) => {
  res.send("Community Alert API is running");
});

// =====================================
// AUTHENTICATION
// =====================================

// Register
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

// Login
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

// =====================================
// POSTS
// =====================================

// Create Post
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

app.get("/test", (req, res) => {
  res.json({
    message: "test route works"
  });
});

// Get All Posts
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

// Get Single Post
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

// =====================================
// LIKES
// =====================================

// Like Post
app.post("/likes", (req, res) => {

  const {
    post_id,
    user_id
  } = req.body;

  const checkSql =
  "SELECT * FROM likes WHERE post_id = ? AND user_id = ?";

  db.query(
    checkSql,
    [
      post_id,
      user_id
    ],
    (err,result)=>{

      if(err){
        return res.status(500).json({
          message:"Server error"
        });
      }

      if(result.length > 0){

        return res.status(400).json({
          message:"You already liked this post"
        });

      }

      const insertSql =
      `
      INSERT INTO likes
      (post_id,user_id)

      VALUES (?,?)
      `;

      db.query(
        insertSql,
        [
          post_id,
          user_id
        ],
        (err)=>{

          if(err){

            return res.status(500).json({
              message:"Failed to like post"
            });

          }

          // CREATE NOTIFICATION
          const ownerSql =
          `
          SELECT user_id
          FROM posts
          WHERE id = ?
          `;

          db.query(
            ownerSql,
            [post_id],
            (err,post)=>{

              if(post.length > 0){

                const ownerId =
                post[0].user_id;

                if(ownerId !== user_id){

                  const notificationSql =
                  `
                  INSERT INTO notifications
                  (user_id, sender_id, post_id, message)

                  VALUES (?,?,?,?)
                  `;

                  db.query(
                    notificationSql,

                    [
                      ownerId,
                      user_id,
                      post_id,
                      "liked your post"
                    ]

                  );

                }

              }

            }

          );

          res.json({
            message:"Post liked"
          });

        }

      );

    }

  );

});

// Count Likes
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

// Unlike Post
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

app.post("/comment-likes", (req,res)=>{

  const {
    comment_id,
    user_id
  } = req.body;

  const sql = `
  INSERT INTO comment_likes
  (comment_id,user_id)

  VALUES (?,?)
  `;

  db.query(
    sql,
    [
      comment_id,
      user_id
    ],
    (err)=>{

      if(err){

        return res.status(400).json({
          message:"Already liked"
        });

      }

      res.json({
        message:"Comment liked"
      });

    }

  );

app.get("/comments/:id/likes",(req,res)=>{


const {id}=req.params;



const sql =
`
SELECT COUNT(*) AS totalLikes

FROM comment_likes

WHERE comment_id = ?

`;



db.query(
sql,
[id],

(err,result)=>{


if(err){

return res.status(500).json(err);

}


res.json(result[0]);


});


});

});
app.get("/posts/:postId/liked/:userId", (req, res) => {
  const { postId, userId } = req.params;

  const sql =
    "SELECT * FROM likes WHERE post_id = ? AND user_id = ?";

  db.query(
    sql,
    [postId, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        liked: result.length > 0,
      });
    }
  );
});

app.get("/users/:id/posts", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM posts
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

// =====================================
// COMMENTS
// =====================================

// Add Comment
app.post("/comments", (req, res) => {

  const {
    post_id,
    user_id,
    comment
  } = req.body;


  const commentSql = `
    INSERT INTO comments
    (post_id, user_id, comment)
    VALUES (?, ?, ?)
  `;


  db.query(
    commentSql,
    [
      post_id,
      user_id,
      comment
    ],
    (err,result)=>{


      if(err){
        console.log(err);

        return res.status(500).json({
          message:"Failed to add comment"
        });
      }



      const ownerSql =
      `
      SELECT user_id 
      FROM posts 
      WHERE id = ?
      `;


      db.query(
        ownerSql,
        [post_id],
        (err,post)=>{


          if(post.length > 0){


            const ownerId =
            post[0].user_id;



            if(ownerId !== user_id){


              const notificationSql =
              `
              INSERT INTO notifications
              (user_id, sender_id, post_id, message)

              VALUES (?, ?, ?, ?)
              `;


              db.query(
                notificationSql,

                [
                  ownerId,
                  user_id,
                  post_id,
                  `${comment}`
                ]

              );


            }

          }


        }
      );



      res.json({
        message:"Comment added successfully"
      });



    }
  );

});

app.post("/follow", (req, res) => {

  const {
    follower_id,
    following_id
  } = req.body;

  const sql = `
    INSERT INTO follows
    (follower_id, following_id)
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [follower_id, following_id],
    (err, result) => {

      if (err) {
        return res.status(400).json({
          message: "Already following"
        });
      }

      res.json({
        message: "User followed"
      });
    }
  );
});

app.delete("/follow", (req, res) => {

  const {
    follower_id,
    following_id
  } = req.body;

  const sql = `
    DELETE FROM follows
    WHERE follower_id = ?
    AND following_id = ?
  `;

  db.query(
    sql,
    [follower_id, following_id],
    (err, result) => {

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        message:"Unfollowed"
      });

    }
  );
});

app.get(
  "/follow/:followerId/:followingId",
  (req,res)=>{

    const {
      followerId,
      followingId
    } = req.params;

    const sql = `
      SELECT *
      FROM follows
      WHERE follower_id = ?
      AND following_id = ?
    `;

    db.query(
      sql,
      [
        followerId,
        followingId
      ],
      (err,result)=>{

        if(err){
          return res.status(500).json(err);
        }

        res.json({
          following:
            result.length > 0
        });

      }
    );

  }
);

// Chat Mesage
app.post("/messages", (req, res) => {

  const {
    sender_id,
    receiver_id,
    message
  } = req.body;

  const sql = `
    INSERT INTO messages
    (sender_id, receiver_id, message)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      sender_id,
      receiver_id,
      message
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Message sent"
      });

    }
  );

});

app.get(
  "/messages/:user1/:user2",
  (req, res) => {

    const {
      user1,
      user2
    } = req.params;

    const sql = `
      SELECT *
      FROM messages

      WHERE

      (
        sender_id = ?
        AND receiver_id = ?
      )

      OR

      (
        sender_id = ?
        AND receiver_id = ?
      )

      ORDER BY created_at ASC
    `;

    db.query(
      sql,
      [
        user1,
        user2,
        user2,
        user1
      ],
      (err, result) => {

        if (err) {
          return res.status(500).json(err);
        }

        res.json(result);

      }
    );

  }
);

app.get("/conversations/:userId", (req, res) => {

  const { userId } = req.params;

  const sql = `
    SELECT DISTINCT
      users.id,
      users.name
    FROM messages

    JOIN users
      ON (
        users.id = messages.sender_id
        OR
        users.id = messages.receiver_id
      )

    WHERE
      messages.sender_id = ?
      OR
      messages.receiver_id = ?

    AND users.id != ?
  `;

  db.query(
    sql,
    [userId, userId, userId],
    (err, result) => {

      if(err){
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

});

// Get Comments of a Post
app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      comments.*,
      users.name
    FROM comments
    JOIN users
      ON comments.user_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at DESC
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  console.log("GET /users/:id called with:", id);

  const sql =
    "SELECT id, name, email FROM users WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result[0]);
  });
});

app.get("/notifications/:userId", (req, res) => {

  const { userId } = req.params;


  const sql = `
    SELECT
      notifications.*,
      users.name

    FROM notifications

    JOIN users

    ON notifications.sender_id = users.id

    WHERE notifications.user_id = ?

    ORDER BY notifications.created_at DESC
  `;


  db.query(
    sql,
    [userId],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to fetch notifications"
        });
      }


      res.json(result);

    }
  );

});

app.put("/notifications/:id/read", (req, res) => {

  const { id } = req.params;


  const sql =
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ?
    `;


  db.query(
    sql,
    [id],
    (err, result) => {

      if(err){
        return res.status(500).json(err);
      }


      res.json({
        message:"Notification marked as read"
      });

    }
  );

});

app.get("/", (req, res) => {
  res.send("Community Alert API is running");
});

// Delete Comment
app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;

  const sql =
    "DELETE FROM comments WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Comment deleted",
    });
  });
});

app.put("/posts/:id", (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    category,
  } = req.body;

  const sql = `
    UPDATE posts
    SET
      title = ?,
      description = ?,
      category = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title,
      description,
      category,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to update post",
        });
      }

      res.json({
        message: "Post updated successfully",
      });
    }
  );
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;

  console.log("Deleting post:", id);

  const deleteLikesSql =
    "DELETE FROM likes WHERE post_id = ?";

  const deleteCommentsSql =
    "DELETE FROM comments WHERE post_id = ?";

  const deletePostSql =
    "DELETE FROM posts WHERE id = ?";

  db.query(deleteLikesSql, [id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to delete likes",
      });
    }

    db.query(deleteCommentsSql, [id], (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to delete comments",
        });
      }

      db.query(deletePostSql, [id], (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Failed to delete post",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Post not found",
          });
        }

        res.json({
          message: "Post deleted successfully",
        });
      });
    });
  });
});

// =====================================
// SERVER
// =====================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});