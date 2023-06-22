import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [usersSaved, setUsersSaved] = useState([{}]);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, usersSaved, setUsersSaved }}>
      {children}
    </UserContext.Provider>
  );
};
