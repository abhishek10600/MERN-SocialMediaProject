import React, { useState } from "react";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import Spinner from "../components/General/Spinner";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { logoutUser } from "../api/auth.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";

const FeedPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading } = useSelector((state: RootState) => state.auth);
  const [serverError, setServerError] = useState<string | null>(null);
  if (loading) {
    return <Spinner />;
  }

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      toast.success(response.message);
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container flex">
        <Sidebar />
        <div>
          <h1>This is the feed page</h1>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
