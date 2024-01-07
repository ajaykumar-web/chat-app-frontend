// Chat.js

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const initializeSocket = () => {
      if (currentUser) {
        socket.current = io(host);
        socket.current.emit("add-user", currentUser._id);
      }
    };

    initializeSocket();
  }, [currentUser]);

  useEffect(() => {
    const fetchUserContacts = async () => {
      if (currentUser) {
        const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        const filteredContacts = data.filter((contact) =>
          contact.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setContacts(filteredContacts, searchQuery);
      }
    };

    fetchUserContacts();
  }, [currentUser, searchQuery]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-username"
        />
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(2, 66, 96, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
  .search-username {
    width: 95vw;
    border-radius: 2rem;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    gap: 2rem;
    background-color: rgb(255, 255, 255);
    color: rgb(255, 255, 255);
    border: none;
    padding: 1rem;
    color: #000;
  }
  .container {
    height: 80vh;
    width: 95vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
