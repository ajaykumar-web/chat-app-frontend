// Welcome.js

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/smile.png";
import Logout from "./Logout";

export default function Welcome() {
  const [name, setname] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        setname(userData?.name || "");
      } catch (error) {
        console.error("Welcome error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Logout />
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{name}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;

  img {
    height: 20rem;
  }

  span {
    color: #4e0eff;
  }
`;
