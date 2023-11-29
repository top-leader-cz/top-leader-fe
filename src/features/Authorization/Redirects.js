import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./";
import { useEffect, useState } from "react";
import { routes } from "../../routes";
import { intersection, last, pipe, split } from "ramda";
import * as qs from "qs";

export const AuthRedirect = () => {
  let auth = useAuth();
  console.log("[AuthRedirect]", { auth });

  if (!auth.isLoggedIn) {
    return <MyNavigate to={routes.signIn} replace />;
  } else {
    return <MyNavigate to={routes.dashboard} replace />;
  }
};

const omitQuery = (str) => str.replace(/\?[^\?]*/, "");
const extractQuery = pipe(split("?"), (segments) => {
  if (segments.length > 2)
    throw new Error("Invalid query string. TODO:fixme12345");
  if (segments.length === 2) return last(segments);
  return "";
});
const parseQuery = pipe(extractQuery, qs.parse);
// TODO: part of redirect state?
export const MyNavigate = ({ to, ...rest }) => {
  // const locationQ = parseQuery(window.location.href);
  // const toQ = parseQuery(to);
  // const newQstr = qs.stringify({ ...locationQ, ...toQ });

  // const newTo = omitQuery(to) + (newQstr ? "?" + newQstr : "");
  const newTo = to;
  // debugger;

  return <Navigate to={newTo} {...rest} />;
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
  // debugger;

  if (!auth.isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return (
      <MyNavigate
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
      return <MyNavigate to={routes.dashboard} replace />;
  }

  return children;
};

const getAuthorizedLocationRedirect = ({ locationState, currentUsername }) => {
  // const isSavedPathValid = locationState.lastUsername === currentUsername;
  const savedPathname = [
    locationState.from?.pathname || "",
    locationState.from?.search || "",
  ].join("");
  // const savedPathname = isSavedPathValid ? locationState.from?.pathname : "";
  // debugger;
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

    return <MyNavigate to={to} state={{ from: location }} replace />;
  }

  return children;
};
