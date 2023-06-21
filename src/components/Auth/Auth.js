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
      })
      .catch((error) => {
        setError(error.message);
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
