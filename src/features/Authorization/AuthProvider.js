import * as qs from "qs";
import { createContext, useCallback, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSessionStorage } from "../../hooks/useLocalStorage";

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

const _fetchUser = ({ authFetch }) =>
  authFetch({ url: "/api/latest/user-info" });

const throwOnError = (response) => {
  console.log("FETCH ERR", { response });
  const error = new Error("Response not OK");
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
  // Should reflect JSESSIONID cookie obtained during login (httpOnly, not accessible by JS)
  const [isLoggedIn, setIsLoggedIn] = useSessionStorage(false);

  const queryClient = useQueryClient();

  const authFetch = useCallback(
    ({ url, query, method = "GET", type = FETCH_TYPE.JSON, data }) =>
      fetch(qstr(url, query), getInit({ method, data })).then(
        async (response) => {
          if (!response.ok) throwOnError(response);
          try {
            if (type === FETCH_TYPE.JSON) return await response.json();
            if (type === FETCH_TYPE.JSON_WITH_META)
              return { response, json: await response.json() };
            return { response };
          } catch (e) {
            return { response };
          }
        }
      ),
    []
  );

  const signin = ({ username, password }) => {
    loginMutation.mutate({ username, password });
  };

  const signout = () => {
    queryClient.removeQueries();
    setIsLoggedIn(false); // TODO: check
  };

  const loginMutation = useMutation({
    mutationFn: (fields) => _login({ authFetch, ...fields }),
    onSuccess: () => setIsLoggedIn(true),
  });

  const userQuery = useQuery({
    queryKey: ["user-info"],
    queryFn: () => _fetchUser({ authFetch }),
    enabled: !!isLoggedIn,
    retry: false,
    // retryOnMount: false,
    onError: (e) => {
      console.log("%c[AuthProvider.userQuery.onError]", "color:coral", { e });
      if (e?.response?.status === 401) signout(); // TODO: move to authFetch?
    },
  });

  const value = {
    isLoggedIn,
    loginMutation,
    user: userQuery,
    signin,
    signout,
    authFetch,
    fetchUser: () => {
      queryClient.invalidateQueries("user-info"); // TODO: rm?
    },
    isCoach: userQuery.data?.userRoles?.includes(Authority.COACH),
    isHR: userQuery.data?.userRoles?.includes(Authority.HR),
  };

  // console.log("[AP.rndr]", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

const useMyQuery = ({ fetchDef, ...rest }) => {
  const { authFetch } = {}; // TODO
  return useQuery({ ...rest });
};
