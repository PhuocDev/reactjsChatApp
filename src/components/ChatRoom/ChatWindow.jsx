import { UserAddOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Tooltip, Avatar, Form, Input, Alert, Modal, List, Row, Col } from 'antd';
import Message from './Message';
import { ChatContext, ChatProvider } from '../context/chatContext';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import { UserContext } from '../context/userContext';
import { uid } from 'uid';
import 'firebase/auth';
import { set } from 'lodash';
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
  height: 50vh;
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
  const [usersInRoom, setUsersInRoom] = useState([{}]);
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


  //get member of the room from the firebase
  const fetchUsersInRoom = async () => {
    setUsersInRoom([]);
    if (selectedRoom != null) {
      const usersRef = firebase.database().ref(`rooms/${selectedRoom.id}/members`);
      try {
        const snapshot = await usersRef.once('value');
        const members = snapshot.val();
        if (members) {
          const userIdsKey = Object.keys(members);
            console.log("danh sach thanh vien trong phong: ")
            const memberList = [];
            for (const key in userIdsKey) {
              if (userIdsKey.hasOwnProperty.call(userIdsKey, key)) {
                const eachKey = userIdsKey[key];
                memberList.push({userEmail: members[eachKey].userEmail, userId:members[eachKey].userId});
              }
            }
            console.log('ben duoi la memberList');
            console.log(memberList);
            console.log("ben duoi la usersInRoom");
            setUsersInRoom(memberList);
            // console.log(usersInRoom)
            // setUsersInRoom(members[userIdsKey]);
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

  const addUserToRoom = (roomId, userId, userEmail) => {
    // Kiểm tra xem userEmail đã tồn tại trong usersInRoom chưa
    const userExists = usersInRoom.some(user => user.userEmail === userEmail);
    if (userExists) {
      // Nếu đã tồn tại, hiển thị thông báo
      alert("User already exists in the room");
    } else {
      const usersRef = firebase.database().ref(`rooms/${roomId}/user_ids`);
    usersRef
      .child(userId)
      .set(true)
      .then(() => {
        console.log("User added to user_ids successfully");
        //add members
        const roomRef = firebase.database().ref(`rooms/${roomId}`);
        roomRef
          .child("members")
          .push({ userId, userEmail })
          .then(() => {
            fetchUsersInRoom();
          })
          .catch((error) => {
            console.log("Error adding user to room member:", error);
          });
      })
      .catch((error) => {
        console.log("Error adding user to room:", error);
      });
    }

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
          addUserToRoom(selectedRoom.id, firebaseId, email);
          alert('Add new member successfully');
          fetchUsersInRoom();
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
  useEffect(() => {
    // scroll to bottom after message changed
    console.log('chuyen sang phong: ' + selectedRoom.name );
    setMessages([]);
    fetchMessages();
    fetchUsersInRoom();
  }, [selectedRoom.name]);

  //for modal showing user list:
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    console.log(usersInRoom);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleRemoveMember = async ( roomId, userId) => {
    const roomRef = firebase.database().ref(`rooms/${roomId}/members`);
    // Tìm kiếm member có userId tương ứng trong room
    removeMemberFromUserIds(roomId, userId);
    roomRef
      .orderByChild('userId')
      .equalTo(userId)
      .once('value')
      .then((snapshot) => {
        const member = snapshot.val();
        if (member) {
          const memberKey = Object.keys(member)[0];
          // Xoá member khỏi room
          roomRef
            .child(memberKey)
            .remove()
            .then(() => {
              console.log('Member removed successfully');
              fetchUsersInRoom();
            })
            .catch((error) => {
              console.log('Error removing member:', error);
            });
        } else {
          console.log('Member not found');
        }
      })
      .catch((error) => {
        console.log('Error searching for member:', error);
      });
  }
  const removeMemberFromUserIds = async ( roomId,userId) => {
    if (userId === currentUser.uid) {
      alert('this is your room');
    } else {
      try {
        const db = firebase.database();
        const roomRef = db.ref(`rooms/${roomId}`);
        // Fetch the current user IDs of the room
        const roomSnapshot = await roomRef.once("value");
        const roomData = roomSnapshot.val();
        const user_ids = roomData.user_ids || {};
        // Remove the provided userId from the user IDs list
        delete user_ids[userId];
        // Update the user IDs list of the room on Firebase
        await roomRef.update({ user_ids });
        console.log(`User has been removed from user_ids`);
      } catch (error) {
        console.error("Error removing user ID from room:", error);
        alert("Error removing user ID from room");
      }
    }

  }
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
              <Button type="outline-primary" onClick={showModal}>
                Members
              </Button>
              <Modal
                title="Member list:"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                {/* {usersInRoom.map((mem) => {
                  searchMemberByUid(mem);
                })} */}
                {usersInRoom.map((mem) => {
                  return (
                  <Row key={Math.random()}>
                    <Col span={16}>{mem.userEmail}</Col>
                    <Col span={8}>
                      <Button onClick={() => handleRemoveMember(selectedRoom.id,mem.userId)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                )})}
              </Modal>
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
