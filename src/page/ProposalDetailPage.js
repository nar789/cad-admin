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
import moment from "moment-timezone";

export default function ProposalDetailPage() {
  const params = useParams();
  const price = useRef(null);
  const [detail, setDetail] = useState([]);
  const [stage, setStage] = useState(1);
  const [pick, setPick] = useState(0);
  const detailName = useRef(null);
  const detailPrice = useRef(null);
  const duration = useRef(null);

  const navigate = useNavigate();

  const [info, setInfo] = useState({
    userId: "",
    company: "",
    name: "",
    phone: "",
    address: "",
    code: "",
  });
  const baseUrl = Config().baseUrl;
  const fetchUserDetail = (id) => {
    axios
      .post(baseUrl + "proposal/get-by-id", {
        pid: id,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === "fail") {
          alert("유저 정보 로드가 실패했습니다.");
          return;
        }
        setInfo(res.data);
        price.current.value = res.data.price;
        setDetail(JSON.parse(decodeURIComponent(res.data.detail)));
        setStage(res.data.stage);
        duration.current.value = res.data.duration;
        setPick(res.data.pick);
      });
  };

  const update = () => {
    var p = 0;
    detail.map((item, idx) => (p += Number(item.price)));
    price.current.value = p;

    let data = {
      uid: info.uid,
      rid: info.rid,
      price: price.current.value,
      detail: encodeURIComponent(JSON.stringify(detail)),
      duration: duration.current.value,
    };
    console.log(data);

    updateStage(stage);
    updatePick(pick);

    axios.post(baseUrl + "proposal/update", data).then((res) => {
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

  const updatePrice = () => {
    var p = 0;
    detail.forEach((item, i) => {
      p += Number(item.price);
    });
    price.current.value = p;
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

  const updateStage = (status) => {
    axios
      .post(baseUrl + "proposal/update-for-stage", {
        id: info.id,
        stage: status,
      })
      .then((res) => {
        if (res.data === "fail") {
          console.log(res.data);
          return;
        } else {
        }
      });
  };

  const updatePick = (status) => {
    axios
      .post(baseUrl + "proposal/pick-for-admin", {
        pid: info.id,
        rid: info.rid,
        pick: status,
      })
      .then((res) => {
        if (res.data === "fail") {
          console.log(res.data);
          return;
        } else {
        }
      });
  };

  const getDateString = (str) => {
    return moment.utc(str).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  };

  useEffect(() => {
    updatePrice();
  }, [detail]);

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

        <Typography variant="h5">제안 내용 수정</Typography>
      </Stack>

      <Stack direction={"row"} justifyContent={"end"}>
        <Typography sx={{ fontSize: 13 }}>
          마지막 업데이트 : {getDateString(info.updated)}
        </Typography>
      </Stack>

      <Stack sx={{ py: 3 }}>
        <Typography>ID : {info.id}</Typography>
        <Stack direction={"row"}>
          <Typography sx={{ mt: 2 }}>업체 ID : {info.uid}</Typography>

          <Button
            sx={{ ml: 3 }}
            variant="contained"
            color="info"
            size="large"
            onClick={() => navigate("/admin/user-detail/" + info.uid)}
          >
            시공업체정보
          </Button>
        </Stack>

        <Stack direction={"row"}>
          <Typography sx={{ mt: 2 }}>요청 ID : {info.rid}</Typography>

          <Button
            sx={{ ml: 3 }}
            variant="contained"
            color="info"
            size="large"
            onClick={() => navigate("/admin/request-detail/" + info.rid)}
          >
            의뢰 내용
          </Button>
        </Stack>

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

        <Typography sx={{ mt: 5, mb: 2 }}>
          채택여부 (채택 시 견적받기가 종료되므로 주의가 필요합니다.)
        </Typography>

        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="user-type"
          value={pick}
          onChange={(e) => {
            setPick(Number(e.target.value));
            //updateStage(Number(e.target.value));
          }}
        >
          <FormControlLabel value="0" control={<Radio />} label="미채택" />
          <FormControlLabel value="1" control={<Radio />} label="채택" />
        </RadioGroup>

        <Typography sx={{ mt: 5, mb: 2 }}>진행상태</Typography>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="user-type"
          value={stage}
          onChange={(e) => {
            setStage(Number(e.target.value));
          }}
        >
          <FormControlLabel value="1" control={<Radio />} label="상담예정" />
          <FormControlLabel value="2" control={<Radio />} label="진행중" />
          <FormControlLabel value="3" control={<Radio />} label="작업완료" />
        </RadioGroup>

        <Typography sx={{ mt: 5 }}>공사기간(개월)</Typography>
        <TextField inputRef={duration} placeholder="공사기간" type="number" />

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
