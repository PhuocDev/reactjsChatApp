import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import UserInfor from './UserInfor';
import RoomList from './RoomList';
// import UserInfo from './UserInfo';
// import RoomList from './RoomList';

const SidebarStyled = styled.div`
  background: #6675DF;
  color: white;
  height: 100vh;
`;

export default function SideBar() {
  return (
    <SidebarStyled>
      <Row>
        <Col span={24}>
          <UserInfor />
        </Col>
        <Col span={24}>
          <RoomList />
        </Col>
      </Row>
    </SidebarStyled>
  );
}
