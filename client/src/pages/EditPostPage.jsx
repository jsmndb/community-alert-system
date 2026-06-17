import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function EditPostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/posts/${id}`
      );

      setTitle(response.data.title);
      setDescription(response.data.description);
      setCategory(response.data.category);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/posts/${id}`,
        {
          title,
          description,
          category,
        }
      );

      alert(response.data.message);

      navigate("/profile");
    } catch (error) {
      console.log(error);
      alert("Failed to update post");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div
          className="card p-4 mx-auto"
          style={{ maxWidth: "600px" }}
        >
          <h2>Edit Post</h2>

          <form onSubmit={handleUpdate}>

            <input
              type="text"
              className="form-control mb-3"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

            <textarea
              className="form-control mb-3"
              rows="4"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
            />

            <select
              className="form-control mb-3"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
            >
              <option value="Lost Item">
                Lost Item
              </option>

              <option value="Found Item">
                Found Item
              </option>

              <option value="Incident Report">
                Incident Report
              </option>

              <option value="Community Alert">
                Community Alert
              </option>
            </select>

            <button
              className="btn btn-warning w-100"
              type="submit"
            >
              Update Post
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default EditPostPage;