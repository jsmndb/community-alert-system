import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        {
          name,
          email,
          password,
        }
      );

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
        console.log(error);

        if (error.response) {
          alert(error.response.data.message);
        } else {
          alert("Cannot connect to server");
        }
      }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">
          Register
        </h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Register
          </button>

        </form>

        <p className="mt-3 text-center">
          Already have an account?
          <Link to="/login">
            {" "}Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;