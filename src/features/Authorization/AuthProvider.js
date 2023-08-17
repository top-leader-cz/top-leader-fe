import { createContext, useCallback, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSessionStorage } from "../../hooks/useLocalStorage";

export const AuthContext = createContext(null);

const tokenize = ({ email, password }) => btoa(`${email}:${password}`);
const getAuth = ({ email, password, token = tokenize({ email, password }) }) =>
  `Basic ${token}`;
const getInit = ({ method, Authorization, data }) => ({
  method,
  headers: [
    ["Authorization", Authorization],
    ["Accept", "application/json"],
    ["Content-Type", "application/json"],
    ["Access-Control-Allow-Origin", "*"],
  ],
  // credentials: "include",
  /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
  // mode: "no-cors", // "cors" | "navigate" | "no-cors" | "same-origin";
  // referrer: "https://topleader-394306.ey.r.appspot.com/",
  ...(data ? { body: JSON.stringify(data) } : {}),
});

const _fetchUser = ({ authFetch, token }) =>
  console.log("%c[Q.fetchUser]", "color:crimson", { token, authFetch }) ||
  authFetch({
    url: "/api/latest/user-info",
    Authorization: getAuth({ token }),
    // Authorization: getAuth({ email, password }),
  }).then(({ json }) => json);

const throwOnError = (response) => {
  console.log("FETCH ERR", { response });
  // TODO: compare stacktrace
  const error = new Error("Response not OK");
  error.response = response;
  throw error;
  // throw response;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useSessionStorage("");

  const authFetch = useCallback(
    ({
      url,
      method = "GET",
      type = "json",
      data,
      Authorization = getAuth({ token }),
    }) =>
      fetch(url, getInit({ method, Authorization, data })).then(
        async (response) => {
          if (!response.ok) throwOnError(response);
          if (type === "json") return { response, json: await response.json() };
          // TODO: fix {json} => json, add "json+meta" type -> {response, json}
          // return { response };
        }
      ),
    [token]
  );

  const userQuery = useQuery({
    queryKey: ["user-info"],
    queryFn: () => _fetchUser({ authFetch, token }),
    enabled: !!token,
    retry: false,
    retryOnMount: false,
    onError: (e) => {
      console.log("%c[AuthProvider.userQuery.onError]", "color:coral", { e });
      if (e?.response?.status === 401) setToken(""); // TODO: move to authFetch?
    },
  });

  console.log("[AP.rndr]", { userQuery, token });

  const signin = ({ email, password }) => {
    setToken(tokenize({ email, password }));
  };

  const signout = () => {
    setToken("");
  };

  // TODO: rm
  const queryClient = useQueryClient();

  const value = {
    user: userQuery,
    signin,
    signout,
    authFetch,
    fetchUser: () => {
      queryClient.invalidateQueries("user-info");
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

const useMyQuery = ({ fetchDef, ...rest }) => {
  const { authFetch } = {}; // TODO
  return useQuery({ ...rest });
};
