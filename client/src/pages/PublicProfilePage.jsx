import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function PublicProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${id}`
      );

      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${id}/posts`
      );

      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
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

        <h3>User Posts</h3>

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

export default PublicProfilePage;