import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYQnRGnX2nxKTkQ__JQAwr7XHubUGnYvY",
  authDomain: "mrbot-a6796.firebaseapp.com",
  projectId: "mrbot-a6796",
  storageBucket: "mrbot-a6796.firebasestorage.app",
  messagingSenderId: "205573713777",
  appId: "1:205573713777:web:9fb720ca8bd6586e7250d0",
  measurementId: "G-EKWZGSRBD6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;