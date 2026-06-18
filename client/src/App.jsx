import {BrowserRouter, Routes,Route,} from "react-router-dom";
import { Navigate } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import ProfilePage from "./pages/ProfilePage";
import EditPostPage from "./pages/EditPostPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import PostDetailsPage from "./pages/PostDetailsPage";
import NotificationPage from "./pages/NotificationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/home"
          element={<HomePage />}
        />

        <Route
          path="/create-post"
          element={<CreatePostPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/edit-post/:id"
          element={<EditPostPage />}
        />

        <Route
          path="/user/:id"
          element={<PublicProfilePage />}
        />

        <Route
          path="/post/:id"
          element={<PostDetailsPage />}
        />

        <Route
          path="/notifications"
          element={<NotificationPage />}
          />

      </Routes>
    </BrowserRouter>
  );
}

export default App;