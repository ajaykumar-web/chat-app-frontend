// ChatContainer.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { IoMdSend } from "react-icons/io";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [userIsTyping, setUserIsTyping] = useState({});
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );

        const response = await axios.post(recieveMessageRoute, {
          from: data?._id,
          to: currentChat?._id,
        });

        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  const isTyping = () => {
    socket.current.emit("typing", {
      typing: "typing...",
      fromSelf: true,
    });
  };

  socket.current.on("typing", (data) => {
    setUserIsTyping(data);
  });
  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              className={`message ${message.fromSelf ? "sended" : "recieved"}`}
            >
              <div className="content">
                <p>{message.message}</p>
                <small>{message.createdAt}</small>
              </div>
            </div>
          </div>
        ))}
        <h1 style={{ fontSize: "24px" }}>{userIsTyping.typing}</h1>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value) || isTyping(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background: rgb(2, 0, 36);
    background: linear-gradient(90deg, rgba(0, 212, 255, 1) 100%);

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        small {
          text-transform: uppercase;
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #fff;
    color: #000;

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: #000;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #242c80;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #242c80;
      border: none;

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;

        svg {
          font-size: 1rem;
        }
      }

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
