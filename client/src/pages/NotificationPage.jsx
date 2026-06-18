import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function NotificationPage(){

  const [notifications,setNotifications] = useState([]);


  const user = JSON.parse(
    localStorage.getItem("user")
  );


  useEffect(()=>{

    fetchNotifications();

  },[]);



  const fetchNotifications = async()=>{

    try{

      const response = await axios.get(
        `http://localhost:5000/notifications/${user.id}`
      );


      setNotifications(response.data);


    }catch(error){

      console.log(error);

    }

  };



  return (

    <>

    <Navbar/>


    <div className="container mt-4">


      <h2>
        Notifications
      </h2>



      {
        notifications.length === 0 ?

        (
          <div className="alert alert-secondary">
            No notifications yet
          </div>
        )


        :


        notifications.map((item)=>(


          <div
            key={item.id}
            className="card p-3 mb-3"
          >


            <h5>

              {
                item.is_read 
                ? "🔔"
                : "🔴"
              }


              {" "}


              {item.name}


            </h5>



            <p>
              {item.message}
            </p>



            <small>

              {
                new Date(
                  item.created_at
                ).toLocaleString()
              }

            </small>


          </div>


        ))

      }


    </div>


    </>

  );

}


export default NotificationPage;