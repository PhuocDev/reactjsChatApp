import React from 'react';
import { Button, Avatar, Typography } from 'antd';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthProvider';

// import { auth } from '../../firebase/config';
// import { AuthContext } from '../../Context/AuthProvider';
// import { AppContext } from '../../Context/AppProvider';

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
`;

export default function UserInfo() {

  const mockUser = {
    displayName: "John Doe",
    photoURL: "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
  };
  const {
    user: { displayName, photoURL },
  } = React.useContext(AuthContext) || { user: mockUser };

  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='username'>{displayName}</Typography.Text>
      </div>
      <Button
        ghost
        onClick={() => {
          // clear state in App Provider when logout
          // clearState();
          // auth.signOut();
          console.log("clear state and sign out")
        }}
      >
        Đăng xuất
      </Button>
    </WrapperStyled>
  );
}
