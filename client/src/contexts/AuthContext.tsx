import React, { createContext, useState } from "react";
import { getUser } from "src/pages/Actions";
import { User, emptyUser } from "src/interfaces";

export const AuthContext = createContext({
  user: emptyUser,
  setAuth: (user: User) => {},
  unsetAuth: () => {}
});

// Context provider
export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState(getUser());
  const setAuth = (user: User) => {
    window.localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };
  const unsetAuth = () => {
    window.localStorage.clear();
    setUser(emptyUser);
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, unsetAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
