import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./";
import { useEffect, useState } from "react";
import { routes } from "../../routes";
import { intersection } from "ramda";

export const AuthRedirect = () => {
  let auth = useAuth();
  console.log("[AuthRedirect]", { auth });

  if (!auth.isLoggedIn) {
    return <Navigate to={routes.signIn} replace />;
  } else {
    return <Navigate to={routes.dashboard} replace />;
  }
};

export const RequireAuth = ({ children, someRequired = [] }) => {
  const auth = useAuth();
  const location = useLocation();

  const [lastUsername, setLastUsername] = useState("");
  const username = auth.user?.data?.username;
  useEffect(() => {
    if (username) setLastUsername(username);
  }, [username]);

  console.log("[RequireAuth]", !auth.isLoggedIn ? " REDIRECTING" : "", {
    auth,
    location,
  });

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

  if (someRequired.length) {
    if (
      // intersection(auth.user.data?.userRoles, someRequired).length !== someRequired.length
      intersection(auth.user.data?.userRoles, someRequired).length < 1
    )
      return <Navigate to={routes.dashboard} replace />;
  }

  return children;
};

const getAuthorizedLocationRedirect = ({ locationState, currentUsername }) => {
  const isSavedPathValid = true; // TODO: discuss
  // const isSavedPathValid = locationState.lastUsername === currentUsername;
  const savedPathname = isSavedPathValid ? locationState.from?.pathname : "";

  return savedPathname || routes.dashboard;
};

export const ForbidAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  console.log("[ForbidAuth]", auth.isLoggedIn ? " REDIRECTING" : "", {
    auth,
    location,
  });

  if (auth.isLoggedIn) {
    const to = getAuthorizedLocationRedirect({
      locationState: location.state || {},
      currentUsername: auth.user.data.username, // depends on GlobalLoader
    });

    return <Navigate to={to} state={{ from: location }} replace />;
  }

  return children;
};
