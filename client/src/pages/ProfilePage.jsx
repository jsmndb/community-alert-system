import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";

function ProfilePage() {

  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [following, setFollowing] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );



  useEffect(() => {

    fetchUser();

    fetchPosts();

    if (
      currentUser &&
      Number(id) !== currentUser.id
    ) {
      checkFollowing();
    }

  }, [id]);



  const fetchUser = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/users/${id}`
      );

      setProfileUser(response.data);

    } catch (error) {

      console.log(error);

    }

  };



  const fetchPosts = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/users/${id}/posts`
      );

      setPosts(response.data);

    } catch (error) {

      console.log(error);

    }

  };



  const checkFollowing = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/follow/${currentUser.id}/${id}`
      );

      setFollowing(
        response.data.following
      );

    } catch (error) {

      console.log(error);

    }

  };



  const handleFollow = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/follow",
        {
          follower_id: currentUser.id,
          following_id: id,
        }
      );

      alert(response.data.message);

      setFollowing(true);

    } catch (error) {

      console.log(error);

    }

  };



  const handleUnfollow = async () => {

    try {

      const response = await axios.delete(
        "http://localhost:5000/follow",
        {
          data: {
            follower_id: currentUser.id,
            following_id: id,
          },
        }
      );

      alert(response.data.message);

      setFollowing(false);

    } catch (error) {

      console.log(error);

    }

  };



  const deletePost = async (postId) => {

    const confirmDelete = window.confirm(
      "Delete this post?"
    );

    if (!confirmDelete) return;

    try {

      const response = await axios.delete(
        `http://localhost:5000/posts/${postId}`
      );

      alert(response.data.message);

      fetchPosts();

    } catch (error) {

      console.log(error);

      alert("Failed to delete post");

    }

  };



  if (!currentUser) {

    return (
      <div className="container mt-5">
        <h3>Please login first.</h3>
      </div>
    );

  }



  if (!profileUser) {

    return (
      <div className="container mt-5">
        <h3>Loading...</h3>
      </div>
    );

  }



  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="card p-4 mb-4">

          <h2>
            {profileUser.name}
          </h2>

          <p>
            {profileUser.email}
          </p>

          <p>
            Total Posts: {posts.length}
          </p>



          {
            currentUser.id !== Number(id) && (

              following ? (

                <button
                  className="btn btn-secondary"
                  onClick={handleUnfollow}
                >
                  Following
                </button>

              ) : (

                <button
                  className="btn btn-primary"
                  onClick={handleFollow}
                >
                  Follow
                </button>

              )

            )
          }

        </div>



        <h3 className="mb-3">

          {
            currentUser.id === Number(id)
              ? "My Posts"
              : `${profileUser.name}'s Posts`
          }

        </h3>



        {
          posts.length === 0 ? (

            <div className="alert alert-info">
              No posts yet.
            </div>

          ) : (

            posts.map((post) => (

              <div
                key={post.id}
                className="card mb-3"
              >

                <div className="card-body">

                  <h5>
                    {post.title}
                  </h5>

                  <p>
                    {post.description}
                  </p>

                  <span className="badge bg-primary">
                    {post.category}
                  </span>



                  {
                    post.image && (

                      <div className="mt-3">

                        <img
                          src={`http://localhost:5000/uploads/${post.image}`}
                          alt={post.title}
                          className="img-fluid rounded"
                        />

                      </div>

                    )
                  }



                  {
                    currentUser.id ===
                    post.user_id && (

                      <div className="mt-3">

                        <Link
                          to={`/edit-post/${post.id}`}
                          className="btn btn-primary btn-sm me-2"
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            deletePost(post.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    )
                  }

                </div>

              </div>

            ))

          )
        }

      </div>
    </>
  );
}

export default ProfilePage;