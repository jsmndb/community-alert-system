import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Navbar() {

  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {

    if(user){
      fetchNotifications();
    }

  }, []);

  const fetchNotifications = async () => {

    try {

      const response = await axios.get(

        `http://localhost:5000/notifications/${user.id}`

      );

      setNotifications(response.data);

    } catch(error){

      console.log(error);

    }

  };

  const markAsRead = async (id) => {

  try {

    await axios.put(
      `http://localhost:5000/notifications/${id}/read`
    );

    fetchNotifications();

  } catch(error){

    console.log(error);

  }

};

  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container">


        <Link
          className="navbar-brand"
          to="/home"
        >
          Community Alert
        </Link>

        <div>

          <Link
            className="btn btn-dark me-2"
            to="/create-post"
          >
            Create Post
          </Link>

          <div
            className="btn-group"
          >

            <button
              className="btn btn-dark dropdown-toggle"
              data-bs-toggle="dropdown"
            >

              🔔

              {
                notifications.length > 0 &&
                (
                  <span>
                    {" "}
                    {notifications.length}
                  </span>
                )
              }

            </button>

            <ul className="dropdown-menu dropdown-menu-end">

              {
                notifications.length === 0 ?

                (

                  <li className="dropdown-item">
                    No notifications
                  </li>

                ):

                notifications.map((item)=>(

                <li

                key={item.id}

                className="dropdown-item"

                onClick={() =>
                  markAsRead(item.id)
                }

                style={{
                cursor:"pointer"
                }}

                >

                {item.is_read ? "🔔" : "🔴"}

                {" "}

                {item.name}

                {" "}

                {item.message}

                </li>

                ))

              }


            </ul>


          </div>


        </div>


      </div>


    </nav>

  );

}


export default Navbar;