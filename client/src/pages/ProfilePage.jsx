import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function ProfilePage() {
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchPosts();
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

      <h3>My Posts</h3>

      {posts.map((post) => (
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
          </div>
        </div>
      ))}

    </div>
    </>
  );
}

export default ProfilePage;