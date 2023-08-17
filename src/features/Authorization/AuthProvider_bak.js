import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useCallback, useContext, useState } from "react";
import { useSessionStorage } from "../../hooks/useLocalStorage";

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyC2VakNs4SRvIW3DGaP7AlIfGgPgXLg1LA",
  authDomain: "topleader-fb.firebaseapp.com",
  projectId: "topleader-fb",
  storageBucket: "topleader-fb.appspot.com",
  messagingSenderId: "801167932186",
  appId: "1:801167932186:web:ec327d26065a0d9b324aa3",
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
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
      baseUrl = firebaseConfig.authDomain,
      method = "GET",
      type = "json",
      data,
    }) => {
      if (!user) throw new Error("Not signed in");

      const promise = fetch(url, {
        method,
        // credentials: "include",
        headers: [
          ["Authorization", `Bearer ${user.jwt}`],
          // ["Accept", "json"],
          // ["Content-Type", "text/json"],
        ],
        /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
        // mode: "no-cors", // "cors" | "navigate" | "no-cors" | "same-origin";
        // referrer: "",
        ...(data ? { body: JSON.stringify(data) } : {}),
      }).then(async (response) => {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
