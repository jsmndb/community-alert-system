import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Navbar() {

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {

    if (user) {

      fetchNotifications();
      fetchUnreadMessages();

      const interval = setInterval(() => {

        fetchNotifications();
        fetchUnreadMessages();

      }, 5000);

      return () => clearInterval(interval);

    }

  }, []);

  const fetchNotifications = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/notifications/${user.id}`
      );

      setNotifications(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchUnreadMessages = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/messages/unread/${user.id}`
      );

      setUnreadCount(
        response.data.totalUnread
      );

    } catch (error) {

      console.log(error);

    }

  };

  const markAsRead = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/notifications/${id}/read`
      );

      fetchNotifications();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">

      <div className="container-fluid px-3">

        <Link
          className="navbar-brand fw-bold"
          to="/home"
        >
          🚨 Community Alert
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >

          <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">

            <Link
              className="btn btn-success"
              to="/create-post"
            >
              Create Post
            </Link>

            <Link
              to="/notifications"
              className="btn btn-dark border"
            >
              🔔 Notifications

              {
                notifications.length > 0 && (

                  <span className="badge bg-danger ms-2">
                    {notifications.length}
                  </span>

                )
              }

            </Link>

            <Link
              to="/messages"
              className="btn btn-outline-light"
            >
              💬 Messages

              {
                unreadCount > 0 && (

                  <span className="badge bg-danger ms-2">
                    {unreadCount}
                  </span>

                )
              }

            </Link>

            <Link
              to={`/profile/${user?.id}`}
              className="btn btn-outline-warning"
            >
              👤 Profile
            </Link>

          </div>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;