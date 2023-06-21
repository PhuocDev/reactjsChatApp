import React, { useState } from 'react';
import { AuthContext } from './AuthProvider';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const mockUser = {
    uid: '123456',
  };
  const mockRooms = [
    { id: '1', name: 'Room 1', members: ['123456', '789012'] },
    { id: '2', name: 'Room 2', members: ['123456', '345678'] },
    { id: '3', name: 'Room 3', members: ['123456', '901234'] },
  ];
  const mockUsers = [
    { uid: '789012', displayName: 'User 1' },
    { uid: '345678', displayName: 'User 2' },
    { uid: '901234', displayName: 'User 3' },
  ];

  const selectedRoom = mockRooms.find((room) => room.id === selectedRoomId) || {};

  const clearState = () => {
    setSelectedRoomId('');
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
  };

  return (
    <AppContext.Provider
      value={{
        rooms: mockRooms,
        members: mockUsers,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
