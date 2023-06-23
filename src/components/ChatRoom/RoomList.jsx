import React, { useContext, useEffect, useState } from 'react';
import { Collapse, Typography, Button } from 'antd';
import styled from 'styled-components';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
// import { AppContext } from '../../Context/AppProvider';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import { UserContext } from '../context/userContext';
import { ChatContext } from '../context/chatContext';
import confirm from 'antd/lib/modal/confirm';

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
  const { currentUser } = useContext(UserContext);
  const { selectedRoom, setSelectedRoom } = useContext(ChatContext);


  useEffect(() => {

    // Lấy danh sách phòng chat từ Firebase Firestore
    const fetchRooms = async () => {
      const userId = currentUser ? currentUser.uid : null;
      if (userId) {
        const roomsRef = firebase.database().ref('rooms');
        const userRoomsRef = roomsRef.orderByChild(`user_ids/${userId}`).equalTo(true);

        userRoomsRef.on('value', (snapshot) => {
          const roomsData = snapshot.val();
          if (roomsData) {
            const roomsArray = Object.keys(roomsData).map((roomId) => ({
              id: roomId,
              ...roomsData[roomId],
            }));
            // Lưu danh sách phòng vào state hoặc context
            setRooms(roomsArray);
          } else {
            // Không có phòng nào chứa Id của người dùng hiện tại
            setRooms([]);
          }
        });
      } else {
        // Người dùng chưa đăng nhập
        setRooms([]);
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

      // Lấy thông tin người dùng hiện tại từ Context API
      const currentUserId = currentUser ? currentUser.uid : '';
      // Tạo một khóa mới cho phòng
      const newRoomRef = roomsRef.push();
      // Thiết lập thông tin phòng
      const roomData = {
        name: roomName,
        messages: [],
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      };
    // Thêm currentUserId vào user_ids của phòng
    roomData.user_ids = {
      [currentUserId]: true,
    };
    // Lưu thông tin phòng vào Firebase Realtime Database
    await newRoomRef.set(roomData);

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
  const deleteRoom = async (roomName) => {
    try {
      const db = firebase.database();
      const roomsRef = db.ref('rooms');

      // Find the room with the given name
      const snapshot = await roomsRef.orderByChild('name').equalTo(roomName).once('value');

      // If the room exists, delete it
      if (snapshot.exists()) {
        const roomId = Object.keys(snapshot.val())[0]; // Assuming there's only one room with the same name
        await roomsRef.child(roomId).remove();
        console.log(`Deleted room "${roomName}" with ID: ${roomId}`);
      } else {
        console.log(`Room "${roomName}" does not exist`);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };
  const handleDeleteRoom = (roomId) => {
    const roomName = prompt('Enter chat room\'s name to delete:');
    if (roomName) {
      console.log("Tên phòng can xoa là: " + roomName);
      deleteRoom(roomName);
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
          <LinkStyled key={room.id} onClick={() => setSelectedRoom(room)}>
            {room.name}
          </LinkStyled>
        ))}
        <Button
          type='text'
          icon={<PlusSquareOutlined />}
          className='add-room'
          onClick={handleAddRoom}
        >
          Add &nbsp;&nbsp;
        </Button>
        <Button
          type='text'
          icon={<MinusSquareOutlined/>}
          className='add-room'
          onClick={handleDeleteRoom}
        >
          Delete
        </Button>
      </PanelStyled>

      <PanelStyled header='Private chat' key='2'>
        {mockPersons.map((person) => (
          <LinkStyled key={person.id} onClick={() => setSelectedRoom(person)}>
            {person.name}
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
