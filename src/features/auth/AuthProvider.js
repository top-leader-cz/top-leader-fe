import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useCallback, useContext, useState } from "react";

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyC5oHKDaw5WapA8wQq7gvwbkXDQZ8mfmXg",
  authDomain: "hasura-learn-tutorial.firebaseapp.com",
  projectId: "hasura-learn-tutorial",
  storageBucket: "hasura-learn-tutorial.appspot.com",
  messagingSenderId: "22235409920",
  appId: "1:22235409920:web:6a5bcc1eb5d28a5767f2e5",
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signin = ({ email, password }, callback = () => {}) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        console.log("[Auth] signedIn", { userCredential }); // userCredential.user
        return {
          jwt: userCredential.user.accessToken,
          email: userCredential.user.email,
        };
        return userCredential.user.getIdToken().then((jwt) => ({
          jwt,
          email: userCredential.user.email,
        }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("[Auth]", errorCode, ":", errorMessage);
        throw new Error("");
      })
      .then(({ jwt, email }) => {
        console.log("[Auth] got token", { jwt, email });
        setUser({ jwt, email });
      });
    // return fakeAuthProvider.signin(() => {
    //   setUser(newUser);
    //   callback();
    // });
  };

  const signout = (callback = () => {}) => {
    return firebaseAuth.signOut().then((r) => {
      console.log("[Auth] signOut", { r });
      setUser(null);
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

      return fetch(url, {
        method,
        // credentials: "include",
        headers: [
          ["Authorization", `Bearer ${user.jwt}`],
          // ["Accept", "json"],
          // ["Content-Type", "text/json"],
        ],
        /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
        // mode: "no-cors", // "cors" | "navigate" | "no-cors" | "same-origin";
        referrer: "",
        ...(data ? { body: JSON.stringify(data) } : {}),
      });
      // }).then((res) => res[type]());
    },
    [user]
  );

  const value = { user, signin, signout, authFetch };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
