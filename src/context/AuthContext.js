import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  signIn: () => {},
  signOut: () => {},
  confirmation: null,
  setConfirmation: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    // Placeholder: restore user from storage if needed
    // e.g., AsyncStorage.getItem('user').then(...)
  }, []);

  const signIn = (userObj) => {
    setUser(userObj);
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, confirmation, setConfirmation }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
