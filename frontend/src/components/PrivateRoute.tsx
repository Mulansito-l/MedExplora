import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
