import React, { createContext, useState, useReducer } from "react";
import { getUser } from "src/pages/Actions";
import { User, emptyUser } from "src/interfaces";

export const AuthContext = createContext({
  user: emptyUser,
  setUser: (user: User) => {},
  unsetUser: () => {},
});

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setUser": {
      const { user } = action.payload;
      window.localStorage.setItem("user", JSON.stringify(user));
      return {
        ...state,
        user: user,
      };
    }
    case "unsetUser":
      window.localStorage.clear();
      return {
        ...state,
        user: emptyUser,
      };
  }
};

// Context provider
export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initialState = { user: getUser() };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = state;

  const setUser = (user: User) => {
    dispatch({ type: "setUser", payload: { user } });
  };
  const unsetUser = () => {
    dispatch({ type: "unsetUser" });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, unsetUser }}>
      {children}
    </AuthContext.Provider>
  );
};
