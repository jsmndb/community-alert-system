import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function InboxPage() {

  const [users, setUsers] = useState([]);

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {

    fetchConversations();

  }, []);

  const fetchConversations = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/conversations/${currentUser.id}`
      );

      setUsers(response.data);

    } catch(error){

      console.log(error);

    }

  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2>
          Messages
        </h2>

        {
          users.map((user) => (

            <Link
              key={user.id}
              to={`/chat/${user.id}`}
              className="text-decoration-none"
            >

              <div className="card p-3 mb-2">

                <h5>
                  {user.name}
                </h5>

              </div>

            </Link>

          ))
        }

      </div>
    </>
  );
}

export default InboxPage;