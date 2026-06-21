import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [isAlert, setIsAlert] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("user_id", user.id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);
    
    formData.append(
      "is_alert",
      isAlert ? 1 : 0
    );
    try {
      const response = await axios.post(
        "http://localhost:5000/posts",
        formData
      );

      alert(response.data.message);

      navigate("/home");
    } catch (error) {
      console.log(error);
      alert("Failed to create post");
    }
  };

  return (
    <>
      <Navbar />

    <div className="container mt-4">
      <div
        className="card shadow border-0 p-4 mx-auto"
        style={{
          maxWidth: "700px"
        }}
      >
        <h2>Create Post</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />

          <textarea
            className="form-control mb-3"
            placeholder="Description"
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
            <option value="">
              Select Category
            </option>

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

          <input
            type="file"
            className="form-control mb-3"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />

          <div className="form-check mb-3">

            <input
              type="checkbox"
              className="form-check-input"
              id="alert"
              checked={isAlert}
              onChange={(e) =>
                setIsAlert(e.target.checked)
              }
            />

            <label
              className="form-check-label"
              htmlFor="alert"
            >
              🚨 Emergency Alert
            </label>

          </div>

          <button
            className="btn btn-success w-100"
            type="submit"
          >
            Post
          </button>

        </form>
      </div>
    </div>
    </>
  );
}

export default CreatePostPage;