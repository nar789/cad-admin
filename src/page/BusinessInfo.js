import {
  Button,
  Container,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import Config from "../Config";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function BusinessInfo() {
  const name = useRef();
  const cname = useRef();
  const address = useRef();
  const number = useRef();

  const [info, setInfo] = useState({});

  const baseUrl = Config().baseUrl;

  const fetchBusiness = (id) => {
    axios.post(baseUrl + "admin/fetch/business").then((res) => {
      console.log(res.data);
      if (res.data === "fail") {
        alert("사업자 정보 로드가 실패했습니다.");
        return;
      }
      setInfo(res.data);
      name.current.value = res.data.name;
      cname.current.value = res.data.c_name;
      address.current.value = res.data.address;
      number.current.value = res.data.number;
    });
  };

  const update = () => {
    let data = {
      name: name.current.value,
      cname: cname.current.value,
      address: address.current.value,
      number: number.current.value,
    };
    console.log(data);

    axios.post(baseUrl + "admin/update/business", data).then((res) => {
      if (res.data === "fail") {
        console.log(res.data);
        alert("수정이 실패했습니다.");
        return;
      } else {
        alert("수정이 완료되었습니다.");
        window.history.back();
      }
    });
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

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

        <Typography variant="h5">사업자 정보</Typography>
      </Stack>

      <Stack sx={{ py: 3 }}>
        <Typography sx={{ mt: 2 }}>회사 상호명</Typography>
        <TextField inputRef={cname} />

        <Typography sx={{ mt: 2 }}>사업자 번호</Typography>
        <TextField inputRef={number} />

        <Typography sx={{ mt: 2 }}>대표</Typography>
        <TextField inputRef={name} />

        <Typography sx={{ mt: 2 }}>사업장 주소지</Typography>
        <TextField inputRef={address} />

        <Button
          sx={{ mt: 10 }}
          variant="contained"
          color="info"
          size="large"
          onClick={() => update()}
        >
          수정하기
        </Button>
      </Stack>
    </Container>
  );
}
