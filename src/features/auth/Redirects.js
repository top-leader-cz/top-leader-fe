import { Navigate, useLocation } from "react-router-dom";
import { routes } from "../navigation";
import { useAuth } from "./AuthProvider";

export const AuthRedirect = () => {
  let auth = useAuth();

  if (!auth.user) {
    return <Navigate to={routes.signIn} replace />;
  } else {
    return <Navigate to={routes.dashboard} replace />;
  }
};

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  console.log("[RequireAuth]", !auth.user ? " REDIRECTING" : "", { auth });

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={routes.signIn} state={{ from: location }} replace />;
  }

  return children;
}

export function ForbidAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  console.log("[ForbidAuth]", auth.user ? " REDIRECTING" : "", { auth });
  const from = location.state?.from?.pathname || routes.dashboard;

  if (auth.user) {
    return <Navigate to={from} state={{ from: location }} replace />;
  }

  return children;
}
