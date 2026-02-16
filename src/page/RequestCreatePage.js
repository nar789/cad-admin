import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Hidden,
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

export default function RequestCreatePage() {
  const params = useParams();
  const name = useRef(null);
  const uid = useRef(null);
  const address = useRef(null);
  const phone = useRef(null);
  const [house, setHouse] = useState([]);
  const price = useRef(null);
  const [type, setType] = useState(1);
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
  const fetchUserDetail = (id) => {};

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
      uid: uid.current.value,
      name: name.current.value,
      address: address.current.value,
      phone: phone.current.value,
      content: encodeURIComponent(content.current.value),
      type: type,
      price: price.current.value,
      house: encodeURIComponent(JSON.stringify(house)),
      cad: encodeURIComponent(JSON.stringify(cad)),
    };
    console.log(data);

    axios.post(baseUrl + "order", data).then((res) => {
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

  const appendHouse = (f) => {
    console.log("append house " + f);
    const newH = [...house];
    newH.push(f);

    console.log(newH);
    setHouse(newH);
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

        <Typography variant="h5">의뢰 추가</Typography>
      </Stack>

      <Stack sx={{ py: 3 }}>
        <Typography sx={{ mt: 2 }}>사용자 고유번호 :</Typography>
        <TextField inputRef={uid} />

        <Typography sx={{ mt: 2 }}>주소</Typography>
        <TextField inputRef={address} />

        <Stack direction={"row"}>
          <Typography sx={{ mt: 5, mr: 3 }}>내부 사진</Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
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
          <Typography sx={{ mt: 5, mr: 3 }}>캐드파일</Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
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
        <Stack direction={"row"} sx={{ mt: 3 }}>
          {cad.map((item, idx) => (
            <Button
              key={idx}
              sx={{ ml: 3 }}
              variant="contained"
              color="info"
              size="large"
              onClick={() => {
                window.open(baseUrl + "uploads/" + item, "_blank");
              }}
            >
              {item}
            </Button>
          ))}
        </Stack>

        <Typography sx={{ mt: 5 }}>전달할 내용</Typography>
        <TextareaAutosize
          minRows={10}
          maxRows={20}
          style={{ fontSize: 20, marginTop: 20 }}
          ref={content}
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
          추가하기
        </Button>
      </Stack>
    </Container>
  );
}
