import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function ProfilePage() {
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${user.id}/posts`
      );

      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/posts/${id}`
      );

      alert(response.data.message);

      fetchPosts();
    } catch (error) {
      console.log(error);
      alert("Failed to delete post");
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <h3>Please login first.</h3>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="card p-4 mb-4">
          <h2>{user.name}</h2>

          <p>{user.email}</p>

          <p>
            Total Posts: {posts.length}
          </p>
        </div>

        <h3 className="mb-3">
          My Posts
        </h3>

        {posts.length === 0 ? (
          <div className="alert alert-info">
            No posts yet.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="card mb-3"
            >
              <div className="card-body">

                <h5>{post.title}</h5>

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

                <div className="mt-3">

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deletePost(post.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </>
  );
}

export default ProfilePage;