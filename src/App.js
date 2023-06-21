import { useEffect, useState } from 'react';
import './App.css';
import Auth from './components/Auth/Auth';
import ChatRoom from './components/ChatRoom/chatroom';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import {  UserProvider } from './components/context/userContext';
import { ChatProvider } from './components/context/chatContext';
function App() {

  return(
    <UserProvider>
      <ChatProvider>
        <BrowserRouter>
          <Switch>
            <Route component={Auth} path="/login" />
            <Route component={ChatRoom} path="/chatroom" />
          </Switch>
        </BrowserRouter>
      </ChatProvider>
    </UserProvider>
  );
}

export default App;
