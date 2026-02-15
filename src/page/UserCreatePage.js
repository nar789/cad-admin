import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Config from "../Config";
import axios from "axios";

export default function UserCreatePage() {
  const [isCompany, setIsCompany] = useState(false);
  const id = useRef();
  const pw = useRef();
  const name = useRef();
  const address = useRef();
  const phone = useRef();
  const code = useRef();

  const [info, setInfo] = useState({
    userId: "",
    company: "",
    name: "",
    phone: "",
    address: "",
    code: "",
  });
  const baseUrl = Config().baseUrl;

  const getUserType = (company) => {
    if (company) {
      return "company";
    } else {
      return "normal";
    }
  };

  const create = () => {
    let data = {
      id: id.current.value,
      pw: pw.current.value,
      name: isCompany ? "" : name.current.value,
      company: isCompany ? name.current.value : "",
      address: address.current.value,
      phone: phone.current.value,
      code: code.current.value,
    };
    console.log(data);

    axios.post(baseUrl + "join", data).then((res) => {
      if (res.data === "fail") {
        console.log(res.data);
        alert("추가가 실패했습니다.");
        return;
      } else {
        alert("추가가 완료되었습니다.");
        window.history.back();
      }
    });
  };

  useEffect(() => {}, []);

  return (
    <Container sx={{ py: 3 }}>
      <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
        <Button
          onClick={() => {
            window.history.back();
          }}
        >
          <ArrowBackIosNew sx={{ mr: 1 }} />
        </Button>

        <Typography variant="h5">사용자 추가</Typography>
      </Stack>

      <Stack sx={{ py: 3 }}>
        <Typography>아이디</Typography>
        <TextField inputRef={id} />

        <Typography sx={{ mt: 2 }}>비밀번호</Typography>
        <TextField inputRef={pw} type="password" />

        <Typography sx={{ mt: 2 }}>타입</Typography>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="user-type"
          value={getUserType(isCompany)}
          onChange={(e) => {
            console.log(e.target.value);
            if (e.target.value === "company") {
              setIsCompany(true);
            } else {
              setIsCompany(false);
            }
          }}
        >
          <FormControlLabel
            value="normal"
            control={<Radio />}
            label="일반회원"
          />
          <FormControlLabel
            value="company"
            control={<Radio />}
            label="시공업체"
          />
        </RadioGroup>

        <Typography sx={{ mt: 2 }}>이름</Typography>
        <TextField inputRef={name} />

        <Typography sx={{ mt: 2 }}>주소</Typography>
        <TextField inputRef={address} />

        <Typography sx={{ mt: 2 }}>폰번호</Typography>
        <TextField inputRef={phone} />

        <Typography sx={{ mt: 2 }}>추천인코드</Typography>
        <TextField inputRef={code} />

        <Button
          sx={{ mt: 10 }}
          variant="contained"
          color="info"
          size="large"
          onClick={() => create()}
        >
          추가하기
        </Button>
      </Stack>
    </Container>
  );
}
