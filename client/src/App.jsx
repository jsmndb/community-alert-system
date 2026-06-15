import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;