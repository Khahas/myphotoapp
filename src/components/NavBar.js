import React, { useState, useEffect } from "react";
import { Menu, Container, Button, Image } from "semantic-ui-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../asset/v916-nunny-522.jpg";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const NavBar = () => {
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState(false);

  useEffect(() => {
    const userAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth(true);
      } else setUserAuth(false);
    });
  }, []);

  return (
    <Menu
      inverted
      borderless
      style={{ padding: "0.3rem", marginBottom: "20px" }}
      attached
    >
      <Container>
        <Menu.Item name="home">
          <Link to="/">
            <Image size="mini" src={logo} alt="logo" />
          </Link>
        </Menu.Item>
        <Menu.Item>
          <h2>MyPhoto</h2>
        </Menu.Item>
        {/* authenticated menu */}
        {userAuth && (
          <>
            <Menu.Item position="right">
              <Button size="mini" secondary onClick={() => navigate("/album")}>
                Album
              </Button>
            </Menu.Item>

            <Menu.Item position="right">
              <Button size="mini" alert onClick={() => navigate("/addImage")}>
                Add pictures
              </Button>
            </Menu.Item>
          </>
        )}
        <Menu.Item position="right">
          <Button size="mini" warning onClick={() => navigate("/authDetails")}>
            authDetails
          </Button>
        </Menu.Item>
        {!userAuth && (
          <>
            <Menu.Item position="right">
              <Button size="mini" alert onClick={() => navigate("/sign")}>
                Sign up
              </Button>
            </Menu.Item>
            <Menu.Item position="right">
              <Button size="mini" warning onClick={() => navigate("/login")}>
                Login
              </Button>
            </Menu.Item>
          </>
        )}
        ;
      </Container>
    </Menu>
  );
};

export default NavBar;
