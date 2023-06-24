import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [usersSaved, setUsersSaved] = useState([{}]);
  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong localStorage hay không
    const currentUserFirebase = localStorage.getItem('currentUserFirebase');
    if (currentUserFirebase) {
      // Nếu có, cập nhật currentUser từ localStorage
      setCurrentUser(JSON.parse(currentUserFirebase));
    }
  }, []);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, usersSaved, setUsersSaved }}>
      {children}
    </UserContext.Provider>
  );
};
