import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

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
      await axios.post(
        "http://localhost:5000/likes",
        {
          post_id: postId,
          user_id: user.id,
        }
      );

      fetchLikes(postId);
    } catch (error) {
  if (error.response) {
    alert(error.response.data.message);
  } else {
    alert("Something went wrong");
  }
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

  return (
    <div className="container mt-4">

      <div className="mb-3">
        <Link
          to="/create-post"
          className="btn btn-success"
        >
          Create Post
        </Link>
      </div>

      <h2 className="mb-4">
        Community Feed
      </h2>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="card mb-3"
          >

            <div className="card-body">

              <h5>{post.title}</h5>

              <p>
                <strong>Posted by:</strong> {post.name}
              </p>

              <p>{post.description}</p>

              <span className="badge bg-primary">
                {post.category}
              </span>

              {post.image && (
                <div className="mt-3">
                  <img
                    src={`http://localhost:5000/uploads/${post.image}`}
                    alt={post.title}
                    className="img-fluid rounded"
                  />
                </div>
              )}

              <p className="mt-2">
                👍 {likes[post.id] || 0} Likes
              </p>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleLike(post.id)}
              >
                👍 Like
              </button>

              <div className="mt-3">
                <h6>Comments</h6>

                {comments[post.id]?.map((comment) => (
                  <div
                    key={comment.id}
                    className="border rounded p-2 mb-2"
                  >
                    <strong>{comment.name}</strong>

                    <p className="mb-0">
                      {comment.comment}
                    </p>
                  </div>
                ))}
              </div>

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Write a comment..."
                value={commentText[post.id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
              />

              <button
                className="btn btn-success btn-sm"
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
  );
}

export default HomePage;