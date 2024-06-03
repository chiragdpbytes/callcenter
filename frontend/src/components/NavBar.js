import React from "react";
import { Container, Image, Menu, MenuItem } from "semantic-ui-react";

const NavBar = () => {
  return (
    <Menu>
      <Container>
        <MenuItem>
          <i className="phone icon"></i>
        </MenuItem>
        <MenuItem>Call Center</MenuItem>
        <MenuItem position="right">
          <Image src="people icon" avatar />
        </MenuItem>
        <MenuItem>Cris</MenuItem>
      </Container>
    </Menu>
  );
};

export default NavBar;
