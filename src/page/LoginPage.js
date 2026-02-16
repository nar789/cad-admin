import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Config from "../Config";

export default function LoginPage() {
  const navigate = useNavigate();
  const baseUrl = Config().baseUrl;

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const login = () => {
    const data = {
      id: id,
      pw: pw,
    };
    axios.post(baseUrl + "login", data).then((res) => {
      const data = JSON.parse(decodeURIComponent(res.data));
      if (data.result === "success") {
        const d = data.info;
        if (d.userId === "admin") {
          console.log(d);
          window.localStorage.setItem("id", d.id);
          window.localStorage.setItem("userId", d.userId);
          window.localStorage.setItem("name", d.name);
          navigate("/admin");
          window.location.reload();
        } else {
          alert("관리자 권한이 없습니다.");
        }
      } else {
        alert("아이디 또는 비밀번호가 틀립니다.");
      }
    });
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h6" fontWeight={"bold"}>
        로그인
      </Typography>
      <Box sx={{ mt: 5 }}>
        <Stack spacing={3}>
          <TextField
            label="아이디"
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
          <TextField
            label="비밀번호"
            type="password"
            onChange={(e) => {
              setPw(e.target.value);
            }}
          />
          <Box sx={{ pt: 3 }}>
            <Button
              variant="contained"
              sx={{ py: 1.5 }}
              fullWidth
              onClick={() => login()}
            >
              로그인
            </Button>
          </Box>
          <Button variant="outlined" sx={{ py: 1.5 }} onClick={() => {}}>
            회원가입
          </Button>
          <Stack direction={"row"} justifyContent={"center"}>
            <Button>
              <Typography color="primary">아이디 찾기</Typography>
            </Button>
            <Typography sx={{ px: 1, pt: 0.7 }} color="primary">
              /
            </Typography>
            <Button>
              <Typography color="primary">비밀번호 찾기</Typography>
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
