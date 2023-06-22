import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  return (
    <ChatContext.Provider value={{ selectedRoomId, selectedRoom, setSelectedRoom}}>
      {children}
    </ChatContext.Provider>
  );
};
