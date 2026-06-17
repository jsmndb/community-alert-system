import {BrowserRouter, Routes,Route,} from "react-router-dom";
import { Navigate } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import ProfilePage from "./pages/ProfilePage";
import EditPostPage from "./pages/EditPostPage";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;