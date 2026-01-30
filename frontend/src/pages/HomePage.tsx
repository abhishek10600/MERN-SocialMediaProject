import React from "react";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import Spinner from "../components/General/Spinner";

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading } = useSelector((state: RootState) => state.auth);
  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      {user ? (
        <h1 className="text-blue-500">Welcome, {user.username}</h1>
      ) : (
        <h1 className="text-red-500">You are not logged in</h1>
      )}
    </div>
  );
};

export default HomePage;
