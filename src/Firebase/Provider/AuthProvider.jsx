import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import app from "../Firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Social providers
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const signInWithGoogle = (persistence) => {
    setLoading(true);
    if (persistence) {
      return setPersistence(auth, persistence).then(() => signInWithPopup(auth, googleProvider));
    }
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithGithub = (persistence) => {
    setLoading(true);
    if (persistence) {
      return setPersistence(auth, persistence).then(() => signInWithPopup(auth, githubProvider));
    }
    return signInWithPopup(auth, githubProvider);
  };

  const signInWithFacebook = (persistence) => {
    setLoading(true);
    if (persistence) {
      return setPersistence(auth, persistence).then(() => signInWithPopup(auth, facebookProvider));
    }
    return signInWithPopup(auth, facebookProvider);
  };

  const updateUser = (userInfo) => {
    if (auth.currentUser) {
      return updateProfile(auth.currentUser, userInfo);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = { user, setUser, loading, createUser, signIn, logOut, updateUser, signInWithGoogle, signInWithGithub, signInWithFacebook };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;