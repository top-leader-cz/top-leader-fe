import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useCallback, useContext, useState } from "react";
import { useSessionStorage } from "../../hooks/useLocalStorage";

var config = {
  baseUrl: "https://topleader-394306.ey.r.appspot.com",
};

const firebaseAuth = {};

export const AuthContext2 = createContext(null);

export function AuthProvider2({ children }) {
  const [user, setUser] = useSessionStorage("user", null);
  const [signinPending, setSigninPending] = useState(false);

  const signin = ({ email, password }, callback = () => {}) => {
    console.log("[Auth] start");
    setSigninPending(true);
    return signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        console.log("[Auth] signedIn", { userCredential });
        return {
          jwt: userCredential.user.accessToken,
          email: userCredential.user.email,
          displayName: userCredential.user.email, // TODO: Michal
        };
      })
      .catch((error) => {
        console.log("[Auth] err", error.code, ":", error.message);
        setSigninPending(false);
        throw new Error(error);
      })
      .then(({ jwt, email }) => {
        console.log("[Auth] got token", { jwt, email });
        setUser({ jwt, email });
        setSigninPending(false);
      });
    // return fakeAuthProvider.signin(() => {
    //   setUser(newUser);
    //   callback();
    // });
  };

  const signout = (callback = () => {}) => {
    setUser(null);
    return firebaseAuth.signOut().then((r) => {
      console.log("[Auth] signOut", { r });
    });
    // return fakeAuthProvider.signout(() => {
    //   setUser(null);
    //   callback();
    // });
  };

  const authFetch = useCallback(
    ({
      url,
      baseUrl = "",
      // baseUrl = config.baseUrl,
      method = "GET",
      type = "json",
      data,
    }) => {
      // if (!user) throw new Error("Not signed in");
      const username = "slavik.dan12@gmail.com";
      const pass = "pass";
      const token = btoa(`${username}:${pass}`);
      const Authorization = `Basic ${token}`;

      const promise = fetch(baseUrl + url, {
        method,
        // credentials: "include",
        headers: [
          ["Authorization", Authorization],
          // ["Accept", "json"],
          // ["Content-Type", "text/json"],
          ["Accept", "application/json"],
          ["Content-Type", "application/json"],
          ["Access-Control-Allow-Origin", "*"],
        ],
        /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
        // mode: "no-cors", // "cors" | "navigate" | "no-cors" | "same-origin";
        // referrer: "https://topleader-394306.ey.r.appspot.com/",
        ...(data ? { body: JSON.stringify(data) } : {}),
      }).then(async (response) => {
        console.log("%c[Auth2]", "color:crimson");
        if (!response.ok) {
          console.log("TODO", response);
        }
        if (type === "json") return { response, json: await response.json() };
        return { response };
      });
      // }).then((res) => res[type]());
      return promise;
    },
    [user]
  );

  const value = { user, signin, signinPending, signout, authFetch };

  return (
    <AuthContext2.Provider value={value}>{children}</AuthContext2.Provider>
  );
}

export function useAuth2() {
  return useContext(AuthContext2);
}
