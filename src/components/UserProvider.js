// This is the User Provider for the app. It is used to store the user state and provide it to the rest of the app.
// It does this by using the useContext hook to create a user state and a setUser function.
// React providers are used to provide state to the rest of the app.

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../database/firebase-config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
