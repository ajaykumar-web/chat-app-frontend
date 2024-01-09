// Logout.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const id = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      )._id;
      const response = await axios.get(`${logoutRoute}/${id}`);

      if (response.status === 200) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #242c80;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;

  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
