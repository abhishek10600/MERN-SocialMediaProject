import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { JSX } from "react";
import Spinner from "../components/General/Spinner";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const PublicRoute = ({ children }: Props) => {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute
