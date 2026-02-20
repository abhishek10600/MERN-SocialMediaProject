import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { toast, ToastContainer } from "react-toastify";
import FeedPage from "./pages/FeedPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./api/auth.api";
import { setAuthLoad, setUser } from "./store/slices/authSlice";
import type { RootState } from "./store/store";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import ProfilePage from "./pages/ProfilePage";
import UploadPostPage from "./pages/UploadPostPage";
import EditPostPage from "./pages/EditPostPage";
import ChatPage from "./pages/ChatPage";
import { connectSocket } from "./socket";
import PostDetailPage from "./pages/PostDetailPage";

const App = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(setUser(response.data));
      } catch (error) {
      } finally {
        dispatch(setAuthLoad());
      }
    };

    loadUser();
  }, [dispatch]);

  useEffect(() => {
    if (!user?._id) {
      return;
    }
    const socket = connectSocket(user?._id);

    socket.on("postLiked", (data) => {
      console.log("Notification received: ", data);
      toast.success(`${data.message}`);
    });

    socket.on("postCommented", (data) => {
      toast.success(`${data.commentedBy.username} commented on your post`);
    });

    return () => {
      socket.off("postLiked");
      socket.off("postCommented");
    };
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-[#000000]  w-full overflow-x-hidden">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:postId"
          element={
            <ProtectedRoute>
              <PostDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-post"
          element={
            <ProtectedRoute>
              <UploadPostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/:username/post/edit/:postId"
          element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat/:receiverId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
