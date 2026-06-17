import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">

      <Link
        className="navbar-brand"
        to="/home"
      >
        Community Alert
      </Link>

      <div>

        <Link
          className="btn btn-outline-light me-2"
          to="/home"
        >
          Home
        </Link>

        <Link
          className="btn btn-outline-light me-2"
          to="/create-post"
        >
          Create Post
        </Link>

        <Link
          className="btn btn-outline-light me-2"
          to="/profile"
        >
          Profile
        </Link>

        <button
          className="btn btn-danger"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;