import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

    const user = JSON.parse(
    localStorage.getItem("user")
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/posts"
      );

      setPosts(response.data);

      response.data.forEach((post) => {
        fetchLikes(post.id);
        fetchComments(post.id);
        fetchLikedStatus(post.id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLikes = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/posts/${postId}/likes`
      );

      setLikes((prev) => ({
        ...prev,
        [postId]: response.data.totalLikes,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (likedPosts[postId]) {

        await axios.delete(
          "http://localhost:5000/likes",
          {
            data: {
              post_id: postId,
              user_id: user.id,
            },
          }
        );

        setLikedPosts((prev) => ({
          ...prev,
          [postId]: false,
        }));

      } else {

        await axios.post(
          "http://localhost:5000/likes",
          {
            post_id: postId,
            user_id: user.id,
          }
        );

        setLikedPosts((prev) => ({
          ...prev,
          [postId]: true,
        }));
      }

      fetchLikes(postId);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/posts/${postId}/comments`
      );

      setComments((prev) => ({
        ...prev,
        [postId]: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (postId) => {
    try {
      await axios.post(
        "http://localhost:5000/comments",
        {
          post_id: postId,
          user_id: user.id,
          comment: commentText[postId],
        }
      );

      fetchComments(postId);

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLikedStatus = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/posts/${postId}/liked/${user.id}`
      );

      setLikedPosts((prev) => ({
        ...prev,
        [postId]: response.data.liked,
      }));
    } catch (error) {
      console.log(error);
    }
  };

const filteredPosts = posts.filter((post) =>
  (post.title || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (post.description || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (post.category || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

const getCategoryColor = (category) => {

  switch(category){

    case "Lost Item":
      return "bg-warning text-dark";

    case "Found Item":
      return "bg-success";

    case "Incident Report":
      return "bg-secondary";

    case "Community Alert":
      return "bg-danger";

    default:
      return "bg-primary";

  }

};

return (
  <>
    <Navbar />

    <div className="container mt-4 feed-container">

      <div className="card p-3 mb-4">
        <Link
          to="/create-post"
          className="btn btn-success"
        >
          ➕ Create Post
        </Link>
      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="🔍 Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2 className="mb-4">
        Community Feed
      </h2>

      {filteredPosts.length === 0 ? (

        <div className="alert alert-info">
          No posts found.
        </div>

      ) : (

        filteredPosts.map((post) => (

          <div
            key={post.id}
            className="card shadow-sm mb-4"
          >

            <div className="card-body">

              {/* User Header */}

              <div className="d-flex align-items-center mb-3">

                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "20px",
                    fontWeight: "bold"
                  }}
                >
                  {post.name?.charAt(0).toUpperCase()}
                </div>

                <div className="ms-3">

                  <Link
                    to={`/profile/${post.user_id}`}
                    className="text-decoration-none"
                  >
                    <strong>
                      {post.name}
                    </strong>
                  </Link>

                  <div className="text-muted small">
                    {new Date(
                      post.created_at
                    ).toLocaleString()}
                  </div>

                </div>

              </div>

              {/* Emergency Alert */}

              {
                post.is_alert == 1 && (

                  <div className="alert alert-danger">

                    🚨 Emergency Alert

                  </div>

                )
              }

              {/* Category */}

              <span
                className={`badge ${getCategoryColor(post.category)}`}
                style={{
                  fontSize: "0.8rem"
                }}
              >
                {post.category}
              </span>

              <Link
                to={`/post/${post.id}`}
                className="text-decoration-none text-dark"
              >
                <h4
                  className="mt-2 mb-1"
                  style={{
                    fontWeight: "600"
                  }}
                >
                  {post.title}
                </h4>
              </Link>

              <p
                className="text-muted mb-2"
              >
                {post.description}
              </p>

              {/* Image */}

              {
                post.image && (

                  <img
                    src={`http://localhost:5000/uploads/${post.image}`}
                    alt={post.title}
                    className="img-fluid rounded mt-2"
                    style={{
                      width: "100%",
                      maxHeight: "500px",
                      objectFit: "cover"
                    }}
                  />

                )
              }

              {/* Like Count */}

              <div
                className="d-flex gap-3 mt-2 text-muted"
                style={{
                  fontSize: "0.9rem"
                }}
              >

                <span>
                  ❤️ {likes[post.id] || 0} Likes
                </span>

                <span>
                  💬 {comments[post.id]?.length || 0} Comments
                </span>

              </div>
              {/* Buttons */}

              <div className="d-flex gap-2 mt-3">

                <button
                  className={
                    likedPosts[post.id]
                      ? "btn btn-danger btn-sm"
                      : "btn btn-outline-danger btn-sm"
                  }
                  onClick={() =>
                    handleLike(post.id)
                  }
                >
                  {
                    likedPosts[post.id]
                      ? "❤️ Liked"
                      : "❤️ Like"
                  }
                </button>

              </div>

              {/* Comments */}

              <div className="mt-3">

                <h6>
                  💬 Comments
                </h6>

                {
                  comments[post.id]?.map(
                    (comment) => (

                    <div
                      key={comment.id}
                      className="border rounded p-2 mb-2 bg-light"
                    >

                      <strong>
                        {comment.name}
                      </strong>

                      <p className="mb-0">
                        {comment.comment}
                      </p>

                    </div>

                  ))
                }

              </div>

              {/* Add Comment */}

              <input
                type="text"
                className="form-control mt-3"
                placeholder="Write a comment..."
                value={
                  commentText[post.id] || ""
                }
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
              />

              <button
                className="btn btn-success mt-2"
                onClick={() =>
                  handleComment(post.id)
                }
              >
                Comment
              </button>

            </div>

          </div>

        ))
      )}

    </div>

  </>
);
}

export default HomePage;