import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("userToken");
  const { user } = useContext(UserContext);

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
