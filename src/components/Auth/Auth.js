import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { UserContext } from '../context/userContext';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Đăng nhập thành công, lưu thông tin người dùng vào state
        // setUser(userCredential.user);
        console.log("User đã đăng nhập là: " + userCredential.user);
        const newCurrentUser = userCredential.user;
        setCurrentUser(newCurrentUser);
        console.log(userCredential.user.uid);
        console.log(userCredential.user.email);
        console.log(password);
        const currentUserFirebase = {
          email: email,
          uid: userCredential.user.uid
        }
        localStorage.setItem('currentUserFirebase', JSON.stringify(currentUserFirebase));
        history.push("/chatroom");

      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Đăng ký thành công, lưu thông tin người dùng vào state
        setCurrentUser(userCredential.user);
        console.log("Thong tin dang ky: ")
        console.log(userCredential.user.uid);
        console.log(userCredential.user.email);
        addMember(userCredential.user.email, userCredential.user.uid);

      })
      .catch((error) => {
        setError(error.message);
      });
  };
  // Hàm thêm thành viên
  const addMember = (email, firebaseId) => {
    // Tham chiếu đến bảng "members" trong Firebase Realtime Database
    const membersRef = firebase.database().ref('members');

    // Thực hiện thêm thành viên mới
    const newMemberRef = membersRef.push();
    newMemberRef.set({
      email: email,
      firebaseId: firebaseId,
    })
      .then(() => {
        console.log('Thêm thành viên thành công');
      })
      .catch((error) => {
        console.log('Lỗi khi thêm thành viên:', error);
      });
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      {error && <p>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Đăng nhập</button>
      <button onClick={handleSignUp}>Đăng ký</button>
    </div>
  );
};

export default Auth;
