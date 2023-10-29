import * as qs from "qs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSessionStorage } from "../../hooks/useLocalStorage";
import { useStaticCallback } from "../../hooks/useStaticCallback.hook";

export const AuthContext = createContext(null);

const getInit = ({ method, data }) => {
  const isFormData = data instanceof FormData;
  return {
    method,
    headers: [
      ...(isFormData
        ? []
        : [
            ["Accept", "application/json"],
            ["Content-Type", "application/json"],
          ]),
      ["Access-Control-Allow-Origin", "*"],
    ],
    // credentials: "include", // TODO: test
    // mode: "no-cors", // "cors" | "navigate" | "no-cors" | "same-origin";
    ...(isFormData
      ? { body: data }
      : data
      ? { body: JSON.stringify(data) }
      : {}),
  };
};

const _login = ({ authFetch, username, password }) =>
  authFetch({
    type: FETCH_TYPE.FORMDATA,
    method: "POST",
    url: "/login",
    data: (() => {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      console.log("_login", { formData, username, password });
      return formData;
    })(),
  });

const _resetPass = ({ authFetch, password, token }) =>
  authFetch({
    type: FETCH_TYPE.FORMDATA,
    method: "POST",
    url: `/set-password/${token}`,
    data: { password },
  });

const _fetchUser = ({ authFetch }) =>
  authFetch({ url: "/api/latest/user-info" });

const throwOnError = (response) => {
  console.log("FETCH ERR", { response });
  const error = new Error(`Something went wrong. (${response?.status || ""})`);
  error.response = response;
  throw error;
  // TODO: compare stacktrace
  // throw response;
};

export const FETCH_TYPE = {
  JSON: "JSON",
  JSON_WITH_META: "JSON_WITH_META",
  FORMDATA: "FORMDATA",
};

// src/main/java/com/topleader/topleader/user/User.java
export const Authority = {
  COACH: "COACH",
  USER: "USER",
  ADMIN: "ADMIN",
  HR: "HR",
};

console.log({ qs });

export const qstr = (url, query) => {
  if (!query) return url;
  const qStr = typeof query === "string" ? query : qs.stringify(query);
  return [url, qStr].filter(Boolean).join("?");
};

export function AuthProvider({ children }) {
  // Should reflect JSESSIONID cookie obtained during login (httpOnly, not accessible by JS):
  const [isLoggedIn, setIsLoggedIn] = useSessionStorage(false);

  const queryClient = useQueryClient();

  const qcRef = useRef(queryClient);
  qcRef.current = queryClient;
  const signout = useCallback(() => {
    qcRef.current.removeQueries();
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  const authFetch = useCallback(
    ({ url, query, method = "GET", type = FETCH_TYPE.JSON, data }) =>
      fetch(qstr(url, query), getInit({ method, data }))
        .then(async (response) => {
          if (!response.ok) throwOnError(response);
          try {
            if (type === FETCH_TYPE.JSON) return await response.json();
            if (type === FETCH_TYPE.JSON_WITH_META)
              return { response, json: await response.json() };
            return { response };
          } catch (e) {
            return { response };
          }
        })
        .catch((e) => {
          console.error("[authFetch]", { e, url, method });
          if (e?.response?.status === 401) signout();

          throw e;
        }),
    [signout]
  );

  const userQuery = useQuery({
    queryKey: ["user-info"],
    queryFn: () => _fetchUser({ authFetch }),
    enabled: !!isLoggedIn,
    retry: false,
    // retryOnMount: false,
    onError: (e) => {
      console.log("%c[AuthProvider.userQuery.onError]", "color:coral", { e });
      // if (e?.response?.status === 401) signout(); // TODO: move to authFetch?
    },
  });

  const loginMutation = useMutation({
    mutationFn: (fields) => _login({ authFetch, ...fields }),
    onSuccess: () => setIsLoggedIn(true),
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (fields) => _resetPass({ authFetch, ...fields }),
    onSuccess: () => setIsLoggedIn(true),
  });

  const value = {
    isLoggedIn,
    loginMutation,
    resetPasswordMutation,
    user: userQuery,
    signout,
    authFetch,
    fetchUser: () => {
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
    },
    isCoach: userQuery.data?.userRoles?.includes(Authority.COACH),
    isHR: userQuery.data?.userRoles?.includes(Authority.HR),
    isAdmin: userQuery.data?.userRoles?.includes(Authority.ADMIN),
  };

  // console.log("[AP.rndr]", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

const noop = () => {};

// Following code fixes onSuccess and onError removed in react-query 5
// https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5
// https://github.com/TanStack/query/discussions/5279
export const useMyQuery = ({
  fetchDef,
  onSuccess,
  onError,
  queryFn,
  ...rest
}) => {
  const { authFetch } = useAuth();
  const query = useQuery({
    queryFn: queryFn ?? (() => authFetch(fetchDef)),
    ...rest,
  });

  const data = query.data;
  const sCurrent = useStaticCallback(onSuccess ?? noop);
  useEffect(() => {
    if (data) sCurrent(data);
  }, [data, sCurrent]);

  const error = query.error;
  const eCurrent = useStaticCallback(onError ?? noop);
  useEffect(() => {
    if (error) eCurrent(error);
  }, [error, eCurrent]);

  return query;
};
