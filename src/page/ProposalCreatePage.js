import {
  Button,
  Container,
  duration,
  FormControl,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBackIosNew, RedoSharp } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Config from "../Config";
import axios from "axios";

export default function ProposalCreatePage() {
  const params = useParams();
  const price = useRef(null);
  const [detail, setDetail] = useState([]);
  const detailName = useRef(null);
  const detailPrice = useRef(null);
  const duration = useRef(null);
  const uid = useRef(null);

  const navigate = useNavigate();

  const baseUrl = Config().baseUrl;
  const fetchUserDetail = (id) => {};

  const update = () => {
    let data = {
      uid: uid.current.value,
      rid: params.id,
      price: price.current.value,
      detail: encodeURIComponent(JSON.stringify(detail)),
      duration: duration.current.value,
    };
    console.log(data);

    axios.post(baseUrl + "proposal/create", data).then((res) => {
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

  const addDetail = () => {
    const newD = [...detail];
    newD.push({
      name: detailName.current.value,
      price: detailPrice.current.value,
    });
    setDetail(newD);
    detailName.current.value = "";
    detailPrice.current.value = "";
  };

  const rmDetail = (idx) => {
    const newD = [];
    detail.forEach((item, i) => {
      if (i !== idx) {
        newD.push(item);
      }
    });
    setDetail(newD);
  };

  useEffect(() => {
    updatePrice();
  }, [detail]);

  const updatePrice = () => {
    var p = 0;
    detail.forEach((item, i) => {
      p += Number(item.price);
    });
    price.current.value = p;
  };

  useEffect(() => {
    console.log(params);
    fetchUserDetail(params.id);
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

        <Typography variant="h5">제안 추가</Typography>
      </Stack>

      <Stack sx={{ py: 3 }}>
        <Typography sx={{ mt: 2 }}>업체 고유 ID</Typography>
        <TextField inputRef={uid} />

        <Typography sx={{ mt: 5 }}>세부내역</Typography>
        <Stack py={5} px={3}>
          {detail.map((item, idx) => (
            <Stack
              justifyContent={"space-between"}
              key={idx}
              direction={"row"}
              mt={1}
            >
              <Typography>{item.name}</Typography>
              <Typography>{Number(item.price).toLocaleString()}원</Typography>
              <Button
                sx={{ ml: 3 }}
                variant="contained"
                color="error"
                size="small"
                onClick={() => rmDetail(idx)}
              >
                삭제
              </Button>
            </Stack>
          ))}
          <Stack justifyContent={"space-between"} direction={"row"} mt={1}>
            <TextField inputRef={detailName} placeholder="내용" />
            <TextField
              inputRef={detailPrice}
              placeholder="가격"
              type="number"
            />
            <Button
              sx={{ ml: 3 }}
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => addDetail()}
            >
              추가
            </Button>
          </Stack>
        </Stack>

        <Typography sx={{ mt: 2 }}>시공 예산</Typography>
        <TextField inputRef={price} disabled />

        <Typography sx={{ mt: 5 }}>공사기간(개월)</Typography>
        <TextField inputRef={duration} placeholder="공사기간" type="number" />

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
