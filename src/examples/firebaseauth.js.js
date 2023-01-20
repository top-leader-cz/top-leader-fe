import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

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
const auth = getAuth(app);

document.getElementById("signin-form").onsubmit = function (event) {
  event.preventDefault();
  let email = document.getElementById("signin-email").value;
  let pass = document.getElementById("signin-password").value;
  signIn(email, pass);
};

document.getElementById("get-token").onclick = function (event) {
  event.preventDefault();
  if (!auth.currentUser) {
    document.getElementById("id-token").innerHTML = "No user signed-in";
    return;
  }
  auth.currentUser
    .getIdToken()
    .then((token) => (document.getElementById("id-token").innerHTML = token));
};

document.getElementById("signOut").onclick = function (event) {
  event.preventDefault();
  signOut(auth).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, ":", errorMessage);
  });
};

function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, ":", errorMessage);
  });
}
