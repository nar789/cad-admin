import {
  Button,
  Container,
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

export default function RequestDetailPage() {
  const params = useParams();
  const name = useRef(null);
  const address = useRef(null);
  const phone = useRef(null);
  const [house, setHouse] = useState([]);
  const price = useRef(null);
  const [type, setType] = useState(0);
  const [cad, setCad] = useState([]);
  const content = useRef(null);

  const fileUploadRef = useRef(null);
  const fileUploadRef2 = useRef(null);

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
      .post(baseUrl + "request/get-by-id", {
        id: id,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === "fail") {
          alert("유저 정보 로드가 실패했습니다.");
          return;
        }
        setInfo(res.data);
        address.current.value = res.data.address;
        fetchHouse(res.data.house);
        price.current.value = res.data.price;
        setType(res.data.type);
        if (res.data.cad.indexOf(".") > 0) {
          setCad(JSON.parse(decodeURIComponent(res.data.cad)));
        }
        content.current.value = decodeURIComponent(res.data.content);
        name.current.value = res.data.name;
        phone.current.value = res.data.phone;
      });
  };

  const fetchHouse = (house) => {
    console.log("getMainHouse()");
    if (house == null || house === undefined || house === "") {
      return "";
    }

    const hlist = JSON.parse(decodeURIComponent(house));

    if (hlist.length > 0) {
      setHouse(hlist);
    } else {
      setHouse([]);
    }
  };

  const update = () => {
    let data = {
      id: info.id,
      name: name.current.value,
      address: address.current.value,
      phone: phone.current.value,
      price: price.current.value,
      type: type,
      house: encodeURIComponent(JSON.stringify(house)),
      cad: encodeURIComponent(JSON.stringify(cad)),
    };
    console.log(data);

    axios.post(baseUrl + "request/update", data).then((res) => {
      if (res.data === "fail") {
        console.log(res.data);
        alert("수정이 실패했습니다.");
        return;
      } else {
        alert("수정이 완료되었습니다.");
        window.location.reload();
      }
    });
  };

  const getDateString = (str) => {
    return moment.utc(str).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  };

  const appendHouse = (f) => {
    console.log("append house " + f);
    const newH = [...house];
    newH.push(f);

    console.log(newH);
    setHouse(newH);
  };

  const rmHouse = (idx) => {
    const newH = [];
    house.forEach((item, i) => {
      if (idx != i) {
        newH.push(item);
      }
    });
    setHouse(newH);
  };

  const rmCad = (idx) => {
    const newC = [];
    cad.forEach((item, i) => {
      if (idx != i) {
        newC.push(item);
      }
    });
    setCad(newC);
  };

  const appendCad = (f) => {
    console.log("append cad " + f);
    const newC = [...cad];
    newC.push(f);

    console.log(newC);
    setCad(newC);
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("files", file);

    axios
      .post(baseUrl + "upload/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [() => formData],
      })
      .then((res) => {
        if (res.data != null) {
          appendHouse(res.data);
        }
      });
  };

  const uploadCad = (file) => {
    const formData = new FormData();
    formData.append("files", file);

    axios
      .post(baseUrl + "upload/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [() => formData],
      })
      .then((res) => {
        if (res.data != null) {
          appendCad(res.data);
        }
      });
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

        <Typography variant="h5">의뢰 정보 수정</Typography>
      </Stack>

      <Stack direction={"row"} justifyContent={"end"}>
        <Typography sx={{ fontSize: 13 }}>
          마지막 업데이트 : {getDateString(info.updated)}
        </Typography>
      </Stack>

      <Stack sx={{ py: 3 }}>
        <Typography>ID : {info.id}</Typography>
        <Stack direction={"row"}>
          <Typography sx={{ mt: 2 }}>사용자 ID : {info.uid}</Typography>

          <Button
            sx={{ ml: 3 }}
            variant="contained"
            color="info"
            size="large"
            onClick={() => navigate("/admin/user-detail/" + info.uid)}
          >
            사용자 정보
          </Button>
        </Stack>

        <Typography sx={{ mt: 2 }}>주소</Typography>
        <TextField inputRef={address} />

        <Stack direction={"row"}>
          <Typography sx={{ mt: 4 }}>내부 사진</Typography>
          <Button
            variant="contained"
            sx={{ mt: 3, ml: 3 }}
            onClick={() => fileUploadRef.current.click()}
          >
            불러오기
            <input
              style={{ display: "none" }}
              ref={fileUploadRef}
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  console.log(file.name);
                  uploadFile(file);
                }
              }}
            />
          </Button>
        </Stack>
        <Stack direction={"row"} sx={{ mt: 1 }} spacing={1}>
          {house.map((item, idx) => (
            <Stack>
              <img
                key={idx}
                width={100}
                height={100}
                alt="img"
                onClick={() => {
                  window.open(baseUrl + "uploads/" + item, "_blank");
                }}
                src={baseUrl + "uploads/" + item}
              />
              <Button onClick={() => rmHouse(idx)}>삭제</Button>
            </Stack>
          ))}
        </Stack>

        <Typography sx={{ mt: 2 }}>시공 예산</Typography>
        <TextField inputRef={price} />

        <Typography sx={{ mt: 2 }}>타입</Typography>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="user-type"
          value={type}
          onChange={(e) => {
            setType(Number(e.target.value));
          }}
        >
          <FormControlLabel value="1" control={<Radio />} label="아파트" />
          <FormControlLabel value="2" control={<Radio />} label="오피스텔" />
          <FormControlLabel value="3" control={<Radio />} label="빌라" />
          <FormControlLabel value="4" control={<Radio />} label="단독주택" />
          <FormControlLabel value="5" control={<Radio />} label="상업공간" />
          <FormControlLabel value="6" control={<Radio />} label="기타" />
        </RadioGroup>

        <Stack direction={"row"}>
          <Typography sx={{ mt: 4 }}>캐드파일</Typography>
          <Button
            variant="contained"
            sx={{ mt: 3, ml: 3 }}
            onClick={() => fileUploadRef2.current.click()}
          >
            불러오기
            <input
              style={{ display: "none" }}
              ref={fileUploadRef2}
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  console.log(file.name);
                  uploadCad(file);
                }
              }}
            />
          </Button>
        </Stack>
        <Stack sx={{ mt: 3 }} spacing={1}>
          {cad.map((item, idx) => (
            <Stack direction={"row"} spacing={1}>
              <Button
                key={idx}
                className="w-3"
                sx={{ ml: 3 }}
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => {
                  window.open(baseUrl + "uploads/" + item, "_blank");
                }}
              >
                {item}
              </Button>
              <Button onClick={() => rmCad(idx)}>삭제</Button>
            </Stack>
          ))}
        </Stack>

        <Typography sx={{ mt: 5 }}>전달할 내용</Typography>
        <TextareaAutosize
          minRows={10}
          maxRows={20}
          style={{ fontSize: 20, marginTop: 20 }}
          ref={content}
          disabled
        />

        <Typography sx={{ mt: 2 }}>이름</Typography>
        <TextField inputRef={name} />

        <Typography sx={{ mt: 2 }}>폰번호</Typography>
        <TextField inputRef={phone} />

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
