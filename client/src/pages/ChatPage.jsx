import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function ChatPage() {

  const { id } = useParams();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

    useEffect(() => {

        fetchMessages();

        const interval = setInterval(() => {

            fetchMessages();

        }, 2000);

        return () => clearInterval(interval);

        }, []);

  const fetchMessages = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/messages/${user.id}/${id}`
      );

      setMessages(response.data);

    } catch(error){

      console.log(error);

    }

  };



  const sendMessage = async () => {

    if(message.trim() === ""){
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/messages",
        {
          sender_id: user.id,
          receiver_id: id,
          message
        }
      );

      setMessage("");

      fetchMessages();

    } catch(error){

      console.log(error);

    }

  };



  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="card p-4">

          <h3>
            Chat
          </h3>

          <div
            style={{
              height: "400px",
              overflowY: "scroll"
            }}
          >

            {
              messages.map((msg) => (

                <div
                  key={msg.id}
                  className={
                    msg.sender_id === user.id
                    ? "text-end mb-2"
                    : "text-start mb-2"
                  }
                >

                  <span
                    className={
                      msg.sender_id === user.id
                      ? "badge bg-primary"
                      : "badge bg-secondary"
                    }
                  >

                    {msg.message}

                  </span>

                </div>

              ))
            }

          </div>


          <input
            className="form-control mt-3"
            placeholder="Type message..."
            value={message}
            onChange={(e)=>
              setMessage(e.target.value)
            }
          />

          <button
            className="btn btn-success mt-2"
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>
    </>
  );
}

export default ChatPage;