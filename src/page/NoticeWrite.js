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

export default function NoticeWrite() {
  const title = useRef();
  const [content, setContent] = useState("");

  const baseUrl = Config().baseUrl;

  const update = () => {
    let data = {
      title: encodeURIComponent(title.current.value),
      content: encodeURIComponent(content),
    };

    axios.post(baseUrl + "admin/create/notice", data).then((res) => {
      if (res.data === "fail") {
        console.log(res.data);
        alert("작성이 실패했습니다.");
        return;
      } else {
        alert("작성이 완료되었습니다.");
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

        <Typography variant="h5">새 공지사항 추가</Typography>
      </Stack>

      <Stack sx={{ py: 3 }}>
        <Typography sx={{ mt: 2 }}>제목</Typography>
        <TextField inputRef={title} />

        <Typography sx={{ mt: 2 }}>내용</Typography>
        <TextareaAutosize
          onChange={(e) => {
            setContent(e.target.value);
          }}
          minRows={10}
          style={{
            fontSize: 15,
          }}
        />

        <Button
          sx={{ mt: 10 }}
          variant="contained"
          color="info"
          size="large"
          onClick={() => update()}
        >
          추가하기
        </Button>
      </Stack>
    </Container>
  );
}
