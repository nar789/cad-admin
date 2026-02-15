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
import DateUtil from "../DateUtil";

export default function NoticeUpdate() {
  const params = useParams();
  const title = useRef();
  const [content, setContent] = useState("");
  const [info, setInfo] = useState({});

  const baseUrl = Config().baseUrl;

  const fetchNoticeDetail = (id) => {
    axios
      .post(baseUrl + "admin/fetch/notice-by-id", {
        id: id,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === "fail") {
          alert("공지사항 정보 로드가 실패했습니다.");
          return;
        }
        setInfo(res.data);
        title.current.value = decodeURIComponent(res.data.title);
        setContent(decodeURIComponent(res.data.content));
      });
  };

  const update = () => {
    let data = {
      id: info.id,
      title: encodeURIComponent(title.current.value),
      content: encodeURIComponent(content),
    };
    console.log(data);

    axios.post(baseUrl + "admin/update/notice", data).then((res) => {
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
    console.log(params);
    fetchNoticeDetail(params.id);
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

        <Typography variant="h5">공지사항 수정하기</Typography>
      </Stack>

      <Stack sx={{ py: 3 }}>
        <Stack direction={"row"} justifyContent={"end"}>
          <Typography sx={{ fontSize: 13 }}>
            마지막 업데이트 : {DateUtil().displayDatetime(info.updated)}
          </Typography>
        </Stack>
        <Typography sx={{ mt: 2 }}>제목</Typography>
        <TextField inputRef={title} />

        <Typography sx={{ mt: 2 }}>내용</Typography>
        <TextareaAutosize
          value={content}
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
          수정하기
        </Button>
      </Stack>
    </Container>
  );
}
