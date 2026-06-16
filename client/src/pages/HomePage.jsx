import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/posts"
      );

      setPosts(response.data);
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
                <strong>Posted by:</strong>{" "}
                {post.name}
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

            </div>
          </div>
        ))
      )}

    </div>
  );
}

export default HomePage;