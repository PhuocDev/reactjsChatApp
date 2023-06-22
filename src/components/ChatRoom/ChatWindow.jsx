import { UserAddOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Tooltip, Avatar, Form, Input, Alert, Modal, List } from 'antd';
import Message from './Message';
import { ChatContext, ChatProvider } from '../context/chatContext';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import { UserContext } from '../context/userContext';
import { uid } from 'uid';
import 'firebase/auth';
// import { db } from '../../firebase/config';
// import { AppContext } from '../../Context/AppProvider';
// import { addDocument } from '../../firebase/services';
// import { AuthContext } from '../../Context/AuthProvider';
// import useFirestore from '../../hooks/useFirestore';

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {

  const {selectedRoom, setSelectedRoom} = useContext(ChatContext);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const [messages, setMessages] = useState([{}]);
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const [firebaseId, setFirebaseId] = useState('');

  const fetchMessages = () => {
    if (selectedRoom != null) {
      const messagesRef = firebase.database().ref(`rooms/${selectedRoom.id}/messages`);
      const fetchMessages = async () => {
        try {
          const snapshot = await messagesRef.once('value');
          const messageData = snapshot.val();
          if (messageData) {
            const messageList = Object.values(messageData);
            setMessages(messageList);
            console.log("đã fetch lại danh sách tin nhắn:")
          }
        } catch (error) {
          console.log('Error fetching messages:', error);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }
  useEffect(() => {
    if (selectedRoom != null) {
      const messagesRef = firebase.database().ref(`rooms/${selectedRoom.id}/messages`);
      const fetchMessages = async () => {
        try {
          const snapshot = await messagesRef.once('value');
          const messageData = snapshot.val();
          if (messageData) {
            const messageList = Object.values(messageData);
            setMessages(messageList);
          }
        } catch (error) {
          console.log('Error fetching messages:', error);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    const fetchUsersInRoom = async () => {
      if (selectedRoom != null) {
        fetchMessages();
        const usersRef = firebase.database().ref(`rooms/${selectedRoom.id}/user_ids`);

        try {
          const snapshot = await usersRef.once('value');
          const userIds = snapshot.val();
          if (userIds) {
            const userIdsArray = Object.keys(userIds);
            console.log("danh sach thanh vien trong phong: ")
            console.log(userIdsArray);
            setUsersInRoom(userIdsArray);
          } else {
            setUsersInRoom([]);
          }
        } catch (error) {
          console.log('Error fetching users in room:', error);
        }
      } else {
        setUsersInRoom([]);
      }
    };

    fetchUsersInRoom();
  }, [selectedRoom]);


  const addUserToRoom = (roomId, userId) => {
    const usersRef = firebase.database().ref(`rooms/${roomId}/user_ids`);
    usersRef
      .child(userId)
      .set(true)
      .then(() => {
        console.log('User added to room successfully');
      })
      .catch((error) => {
        console.log('Error adding user to room:', error);
      });
  };

  const AddUserToRoomButton = () => {
      const email = prompt('Enter user ID/Email (@gmail.com) ');
      console.log(email);
      if (email) {
        searchMemberByEmail(email + '@gmail.com');
      }

  }
  const searchMemberByEmail = (email) => {
    const membersRef = firebase.database().ref('members');
    membersRef
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then((snapshot) => {
        const member = snapshot.val();
        if (member) {
          const memberKey = Object.keys(member)[0];
          setFirebaseId(member[memberKey].firebaseId);
          console.log(`Tìm thấy firebaseId: ${member[memberKey].firebaseId}`);
          // setFirebaseId(firebaseId);
          addUserToRoom(selectedRoom.id, firebaseId);
          alert('Add new member successfully');
        } else {
          console.log('Không tìm thấy email');
          alert('Không tìm thấy email');
        }
      })
      .catch((error) => {
        console.log('Lỗi khi tìm kiếm email:', error);
      });
  };

  const handleInputChange = (e) => {
    // if (e.target.value !== "" && e.target.value != null ) {
    //   setInputValue(e.target.value);
    // } else alert("please enter the message");

    setInputValue(e.target.value);
  };
  const handleOnSubmit = async () => {

    // const messagesRef = firebase.database().ref(`rooms/${selectedRoom.id}/messages`);
    if (inputValue === "") {
      alert("please enter the message");
    } else {
      try {
        const roomsRef = firebase.database().ref('rooms');
        // Tìm phòng hiện tại theo roomId
        const currentRoomRef = roomsRef.child(selectedRoom.id);
        // Lấy danh sách tin nhắn hiện tại từ phòng
        const currentMessages = (await currentRoomRef.child('messages').once('value')).val() || [];
        // Tạo một tin nhắn mới
        const newMessage = {
          userId: currentUser.uid,
          username: currentUser.email,
          roomId: selectedRoom.id,
          content: inputValue,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        // Thêm tin nhắn mới vào danh sách tin nhắn hiện tại
        currentMessages.push(newMessage);
        console.log("da push tin nhan");
        // Cập nhật danh sách tin nhắn trong phòng
        await currentRoomRef.child('messages').set(currentMessages);
        console.log("update room messages");
        // Scroll đến cuối danh sách tin nhắn
        // chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        } catch (error) {
          console.log('Error sending message:', error);
        }
        // Mock addDocument function
        const newMessageList = [...messages, inputValue];
        // setMessages(newMessageList);
        console.log(newMessageList);

        form.resetFields(["message"]);
        setInputValue('');
        fetchMessages();
        // focus to input again after submit
        if (inputRef?.current) {
          setTimeout(() => {
            inputRef.current.focus();
          });
        }
    }
  };

  useEffect(() => {
    if (selectedRoom != null) {
      const roomRef = firebase.database().ref('rooms').child(selectedRoom.id);

      // Lắng nghe sự thay đổi trong danh sách tin nhắn của phòng
      roomRef.child('messages').on('value', (snapshot) => {
        const messagesData = snapshot.val() || [];
        setMessages(messagesData);
      });
    }
  }, []);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);


  return (
    <WrapperStyled>
      {selectedRoom ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <p className="header__title">{selectedRoom.name}</p>
              <span className="header__description">
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type="text"
                onClick={AddUserToRoomButton}
              >
                Invite
              </Button>
              <Avatar.Group size="small" maxCount={2}></Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  content={mes.content}
                  photoURL={null}
                  displayName={mes.username ? mes.username : mes.id}
                  createdAt={mes.timestamp}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name="message">
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  autoComplete="off"
                  required
                />
              </Form.Item>
              <Button type="primary" onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="Hãy chọn phòng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
