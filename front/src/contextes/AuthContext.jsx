import React, { useState } from "react";
export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const lsUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!(lsUser && Date.now() - lsUser?.loginTime < 86400000)) {
    localStorage.removeItem("currentUser");
  }

  const [currentUser, setCurrentUser] = useState(lsUser);
  const value = {
    user: currentUser,
    setUser: setCurrentUser,
  };

  return <AuthContext.Provider value={value} children={children} />;
}

export function useAuth() {
  var Auth = null;
  var lsUser = localStorage.getItem("currentUser");
  if (lsUser) {
    Auth = JSON.parse(lsUser);
  }
  return Auth;
}
