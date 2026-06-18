import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function PostDetailsPage() {

  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);


  const fetchPost = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/posts/${id}`
      );

      setPost(response.data);

    } catch(error){
      console.log(error);
    }

  };


  const fetchComments = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/posts/${id}/comments`
      );

      setComments(response.data);

    } catch(error){
      console.log(error);
    }

  };


  const addComment = async () => {

    try {

      await axios.post(
        "http://localhost:5000/comments",
        {
          post_id: id,
          user_id: user.id,
          comment
        }
      );


      setComment("");

      fetchComments();


    } catch(error){
      console.log(error);
    }

  };


  if(!post){
    return <p>Loading...</p>;
  }


  return (

    <>
    <Navbar />

    <div className="container mt-4">


      <div className="card p-4">


        <h2>
          {post.title}
        </h2>


        <p>
          Posted by:
          {" "}
          {post.name}
        </p>


        <p>
          {post.description}
        </p>


        <span className="badge bg-primary">
          {post.category}
        </span>



        {
          post.image &&

          <img
            src={`http://localhost:5000/uploads/${post.image}`}
            className="img-fluid mt-3"
          />

        }



      </div>



      <div className="card p-4 mt-4">

        <h4>
          Comments
        </h4>


        <input

          className="form-control"

          placeholder="Write a comment"

          value={comment}

          onChange={(e)=>
            setComment(e.target.value)
          }

        />


        <button

          className="btn btn-primary mt-2"

          onClick={addComment}

        >

          Comment

        </button>



        {
          comments.map((item)=>(

            <div
              key={item.id}
              className="border p-2 mt-3"
            >

              <b>
                {item.name}
              </b>

              <div
                key={item.id}
                className="border p-2 mt-3"
                >

                <b>
                {item.name}
                </b>

                <p>
                {item.comment}
                </p>

                <button

                className="btn btn-sm btn-outline-danger"

                onClick={async()=>{await axios.post("http://localhost:5000/comment-likes",
                {
                comment_id:item.id,
                user_id:user.id
                }
                );

                fetchComments();

                }}

                >
                ❤️ Like

                </button>

                </div>
            </div>

          ))
        }

      </div>

    </div>

    </>

  );
}

export default PostDetailsPage;