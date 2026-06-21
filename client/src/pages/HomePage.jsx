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

  return (
    <>
      <Navbar />

    <div
      className="container mt-4"
      style={{
        maxWidth: "850px"
      }}
    >

      <div className="card mb-3 shadow-sm border-0">
        <Link
          to="/create-post"
          className="btn btn-success"
        >
          Create Post
        </Link>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <h2 className="mb-4">
        Community Feed
      </h2>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        filteredPosts.map((post) => (
          <div
            key={post.id}
            className="card mb-3"
          >

            <div className="card-body">

              <Link to={`/post/${post.id}`}>

              {
                post.is_alert == 1 && (

                  <div className="mb-2">

                    <span className="badge bg-danger">

                      🚨 Emergency Alert

                    </span>

                  </div>

                )
              }

              <h5>
              {post.title}
              </h5>

              </Link>

              <p>
                <strong>Posted by:</strong>{" "}

                <Link to={`/profile/${post.user_id}`}>
                  {post.name}
                </Link>
              </p>

              <p>{post.description}</p>

              <span className="badge bg-primary">
                {post.category}
              </span>

              {post.image && (
                <div className="mt-3">
                  <img
                    src={post.image}
                    alt={post.title || "Post image"}
                    className="img-fluid rounded mt-2"
                    style={{
                      maxHeight: "500px",
                      objectFit: "cover",
                      width: "100%"
                    }}
                  />
                </div>
              )}

              <p className="mt-2">
                ❤️ {likes[post.id] || 0} Likes
              </p>

              <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleLike(post.id)}
                >
                  {likedPosts[post.id]
                    ? "❤️ Liked"
                    : "❤️ Like"}
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
    </>
  );
}

export default HomePage;