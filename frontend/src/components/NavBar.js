import React, { useEffect, useState } from "react";
import { Container, Image, Menu, MenuItem } from "semantic-ui-react";

const NavBar = () => {
  const [accessToken, setAccessToken] = useState();

  // function handleAccessToken() {
  //   localStorage.removeItem("token");
  //   setAccessToken(null);
  // }

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    console.log("accessToken =>", accessToken);
    setAccessToken(accessToken);
  }, []);

  return (
    <Menu>
      <Container>
        <MenuItem>
          <i className="phone icon"></i>
        </MenuItem>
        <MenuItem>Trady Call Center</MenuItem>
        <MenuItem position="right">
          <Image src="people icon" avatar />
        </MenuItem>
        <MenuItem>Trady</MenuItem>
        {accessToken && (
          <MenuItem>
            <i
              className="sign-out icon"
              style={{ cursor: "pointer" }}
              // onClick={() => handleAccessToken()}
            ></i>
          </MenuItem>
        )}
      </Container>
    </Menu>
  );
};

export default NavBar;
