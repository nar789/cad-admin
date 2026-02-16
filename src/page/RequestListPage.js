import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";

export default function RequestListPage() {
  const baseUrl = Config().baseUrl;
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(0);

  const navigate = useNavigate();

  const fetchUserList = () => {
    axios.post(baseUrl + "request/get-all", {}).then((res) => {
      if (res.data === "fail") {
        console.log("fail");
      } else {
        setList(res.data);
      }
    });
  };

  const deleteUser = () => {
    axios.post(baseUrl + "request/delete", { id: del.id }).then((res) => {
      if (res.data === "fail") {
        alert("삭제가 실패했습니다.");
        console.log(res.data);
        return;
      } else {
        alert("삭제가 완료되었습니다.");
        window.location.reload();
      }
    });
  };

  const getMainHouse = (house) => {
    if (house == null || house === undefined || house === "") {
      return "";
    }

    const hlist = JSON.parse(decodeURIComponent(house));

    if (hlist.length > 0) {
      return hlist[0];
    } else {
      return "";
    }
  };

  const getDateString = (str) => {
    return moment.utc(str).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {del.id}번 의뢰를 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            요청 의뢰 삭제 시, 복원이 불가합니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            취소
          </Button>
          <Button
            onClick={() => deleteUser()}
            autoFocus
            color="error"
            variant="contained"
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
      <Stack
        direction={"row"}
        sx={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/request-create");
          }}
        >
          의뢰 추가
        </Button>
      </Stack>
      <TableContainer sx={{ py: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>사용자ID</TableCell>
              <TableCell>주소</TableCell>
              <TableCell>대표이미지</TableCell>
              <TableCell>총예산</TableCell>
              {/* <TableCell>타입</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>폰</TableCell> */}
              <TableCell>시간날짜</TableCell>
              <TableCell>제안목록</TableCell>
              <TableCell>수정</TableCell>
              <TableCell>삭제</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item, idx) => {
              return (
                <TableRow
                  key={idx}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell>
                    <Link
                      onClick={() => {
                        navigate("/user-detail/" + item.uid);
                      }}
                    >
                      {item.uid}번유저
                    </Link>
                  </TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>
                    {item.house.indexOf(".") > 0 && (
                      <img
                        width={100}
                        height={100}
                        alt="img"
                        src={baseUrl + "uploads/" + getMainHouse(item.house)}
                      />
                    )}
                  </TableCell>
                  <TableCell>{Number(item.price).toLocaleString()}</TableCell>
                  {/* <TableCell>{item.type}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.phone}</TableCell> */}
                  <TableCell sx={{ fontSize: 13 }}>
                    {getDateString(item.updated)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        navigate("/proposal/" + item.id);
                      }}
                    >
                      제안
                      <br />
                      목록
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => {
                        navigate("/request-detail/" + item.id);
                      }}
                    >
                      수정
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setDel(item);
                        setOpen(true);
                      }}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
