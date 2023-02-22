import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import { Typography } from "antd";

const { Title } = Typography;

export const ProfilePage = () => {
    const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch("http://localhost:3001/my", {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <Title>Profile Page</Title>
      {userData && (
        <>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Username: {userData.username}</p>
        </>
      )}
    </>
  );
};
