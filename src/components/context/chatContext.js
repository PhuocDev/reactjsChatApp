import React, { createContext, useRef, useState } from 'react';
import emailjs, { init } from "@emailjs/browser";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  init("zpVPzBAUy1sFnFXU-");

  const sendEmailNotification = (templateParams) => {
    const {user_email, message} = templateParams;
    console.log('sending email');
    emailjs.send("service_d7cdxfs", "template_vg5f9yh", {
      message: message,
      user_email: user_email,
    }, "zpVPzBAUy1sFnFXU-").then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("FAILED...", error);
        alert("Sending email error, try again later");
      }
    );
  };

  return (
    <ChatContext.Provider value={{ selectedRoomId, selectedRoom, setSelectedRoom, sendEmailNotification}}>
      {children}
    </ChatContext.Provider>
  );
};
