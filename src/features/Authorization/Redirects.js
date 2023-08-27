import { Navigate, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import { useAuth } from "./";
import { useEffect, useState } from "react";

export const AuthRedirect = () => {
  let auth = useAuth();
  console.log("[AuthRedirect]", { auth });

  if (!auth.isLoggedIn) {
    return <Navigate to={routes.signIn} replace />;
  } else {
    return <Navigate to={routes.dashboard} replace />;
  }
};

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  console.log("[RequireAuth]", !auth.isLoggedIn ? " REDIRECTING" : "", {
    auth,
  });
  const [lastUsername, setLastUsername] = useState("");
  const username = auth.user?.data?.username;
  useEffect(() => {
    if (username) setLastUsername(username);
  }, [username]);

  if (!auth.isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return (
      <Navigate
        to={routes.signIn}
        state={{ from: location, lastUsername }}
        replace
      />
    );
  }

  return children;
}

export function ForbidAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  console.log("[ForbidAuth]", auth.isLoggedIn ? " REDIRECTING" : "", { auth });

  if (auth.isLoggedIn) {
    const to =
      (location.state?.lastUsername === auth.user.data.username // depends on GlobalLoader
        ? location.state?.from?.pathname
        : "") || routes.dashboard;
    return <Navigate to={to} state={{ from: location }} replace />;
  }

  return children;
}
