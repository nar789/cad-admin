import {
  AppBar,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import banner from "./assets/img/logo.png";
import { useEffect, useState } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";

function App() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMyInfo = () => {
    handleClose();
  };

  const id = window.localStorage.getItem("id");

  const onLogout = () => {
    alert("로그아웃 되었습니다.");
    setIsLogin(false);
    setName("");

    window.localStorage.removeItem("id");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("name");
    navigate("/");
    handleClose();
  };

  useEffect(() => {
    if (id != null) {
      setIsLogin(true);
      setName(window.localStorage.getItem("name"));
    } else {
      console.log("id is null");
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh !important",
      }}
    >
      <AppBar
        position="static"
        sx={{
          paddingTop: "20px",
          paddingBottom: "20px",
          backgroundColor: "black !important",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar>
            <Button
              sx={{ m: 0, p: 0 }}
              onClick={() => {
                navigate("/");
              }}
            >
              <img src={banner} alt="banner" width={100} />
              <Typography
                sx={{
                  color: "white",
                  fontSize: 25,
                  ml: 2,
                }}
              >
                조달왕 관리자 페이지
              </Typography>
            </Button>
            <Box sx={{ flex: 1 }} />
            <Box
              sx={{
                alignItems: "center",
              }}
            >
              {isLogin ? (
                <Stack direction={"row"}>
                  <Button
                    sx={{ m: 0, p: 0 }}
                    id="myinfo"
                    aria-controls={open ? "demo-positioned-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <Stack sx={{ mr: 2, mt: 0 }} direction={"row"}>
                      <Typography color={"white"}>{name}</Typography>
                      <Typography color={"white"}>님</Typography>
                      <KeyboardArrowDown sx={{ color: "white" }} />
                    </Stack>
                  </Button>
                  <Menu
                    aria-labelledby="myinfo"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Stack>
                      <MenuItem
                        onClick={onMyInfo}
                        style={{ paddingLeft: 20, paddingRight: 20 }}
                      >
                        내 정보
                      </MenuItem>
                      <MenuItem
                        onClick={onLogout}
                        style={{ paddingLeft: 20, paddingRight: 20 }}
                      >
                        로그아웃
                      </MenuItem>
                    </Stack>
                  </Menu>
                </Stack>
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={() => navigate("login")}
                  >
                    로그인
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container sx={{ flex: 1, paddingBottom: 10 }}>
        <Outlet />
      </Container>

      <Container
        sx={{
          paddingTop: 10,
          paddingBottom: 5,
          backgroundColor: "#0D0F12",
          color: "white",
        }}
        maxWidth="full"
      >
        <Box>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <Stack direction={"row"} spacing={10}>
              <Button onClick={() => {}}>
                <Typography color={"white"}>회사소개</Typography>
              </Button>
              <Button onClick={() => {}}>
                <Typography color={"white"}>이용약관</Typography>
              </Button>
              <Button onClick={() => {}}>
                <Typography color={"white"}>개인정보 처리방침</Typography>
              </Button>
              <Button onClick={() => {}}>
                <Typography color={"white"}>사업자 정보</Typography>
              </Button>
            </Stack>
          </Box>
          <Box width={"full"} textAlign={"center"} sx={{ my: 5 }}>
            <Button onClick={() => navigate("")}>
              <Typography variant="h3" color={"white"} />
            </Button>
          </Box>
          <Box width={"full"} textAlign={"center"}>
            <span>2026조달왕 Corp. ALL RIGHTS RESERVED.</span>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
