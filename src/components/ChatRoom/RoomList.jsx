import React, { useEffect, useState } from 'react';
import { Collapse, Typography, Button } from 'antd';
import styled from 'styled-components';
import { PlusSquareOutlined } from '@ant-design/icons';
// import { AppContext } from '../../Context/AppProvider';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }

    .ant-collapse-content-box {
      padding: 0 40px;
    }

    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;
`;

export default function RoomList() {
  const [rooms, setRooms] = useState([]);

  const { setIsAddRoomVisible, setSelectedRoomId } = {
    setIsAddRoomVisible: () => {},
    setSelectedRoomId: () => {},
  };

  useEffect(() => {
    // Lấy danh sách phòng chat từ Firebase Firestore
    const fetchRooms = async () => {
      try {
        const db = firebase.database();
          const roomsRef = db.ref('rooms');

          // Lắng nghe sự thay đổi trên danh sách phòng
          roomsRef.on('value', (snapshot) => {
            const roomData = snapshot.val();
            const roomList = Object.entries(roomData).map(([id, room]) => ({
              id,
              ...room,
            }));
            setRooms(roomList);
          });
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng chat:', error);
      }
    };
    // Gọi hàm fetchRooms để lấy danh sách phòng ban đầu
    fetchRooms();

    // Hủy lắng nghe khi component unmount
    return () => {
      const db = firebase.database();
      const roomsRef = db.ref('rooms');
      roomsRef.off();
    };
  }, [])

  // Thêm phòng mới vào Firebase Firestore
  const addRoom = async (roomName) => {
    try {
      const db = firebase.database();
    const roomsRef = db.ref('rooms');

    // Tạo một khóa mới cho phòng
    const newRoomRef = roomsRef.push();

    // Thiết lập thông tin phòng
    await newRoomRef.set({
      name: roomName,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    });

    console.log('Thêm phòng chat thành công. ID:', newRoomRef.key);
    } catch (error) {
      console.error('Lỗi khi thêm phòng chat:', error);
    }
  };
  const handleAddRoom = () => {
    const roomName = prompt('Nhập tên phòng chat mới:');
    if (roomName) {
      console.log("Tên phòng mới là: " + roomName);
      addRoom(roomName);
    }
  };

  const mockPersons = [
    { id: 1, name: "Person 1" },
    { id: 2, name: "Person 2" },
    { id: 3, name: "Person 3" },
  ];

  const handleAddPerson = () => {
    // setIsAddRoomVisible(true);
    console.log("add more room")
  };

  return (
    <Collapse ghost defaultActiveKey={['1']}>
      <PanelStyled header='Group chat' key='1'>
        {rooms.map((room) => (
          <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>
            {room.name}
          </LinkStyled>
        ))}
        <Button
          type='text'
          icon={<PlusSquareOutlined />}
          className='add-room'
          onClick={handleAddRoom}
        >
          Thêm phòng
        </Button>
      </PanelStyled>

      <PanelStyled header='Private chat' key='2'>
        {mockPersons.map((room) => (
          <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>
            {room.name}
          </LinkStyled>
        ))}
        <Button
          type='text'
          icon={<PlusSquareOutlined />}
          className='add-room'
          onClick={handleAddPerson}
        >
          Thêm người nhận
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
