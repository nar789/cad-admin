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
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBackIosNew, RedoSharp } from "@mui/icons-material";
import moment from "moment-timezone";

export default function ProposalListPage() {
  const params = useParams();
  const baseUrl = Config().baseUrl;
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(0);

  const navigate = useNavigate();

  const fetchUserList = () => {
    axios.post(baseUrl + "proposal/get", { rid: params.id }).then((res) => {
      if (res.data === "fail") {
        console.log("fail");
      } else {
        console.log(res.data);
        setList(res.data);
      }
    });
  };

  const deleteUser = () => {
    axios.post(baseUrl + "proposal/delete", { id: del.id }).then((res) => {
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
    console.log("getMainHouse()");
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

  const handleClose = () => {
    setOpen(false);
  };

  const getStage = (idx) => {
    if (idx === 1) {
      return "상담예정";
    } else if (idx === 2) {
      return "진행중";
    } else if (idx === 3) {
      return "작업완료";
    }
  };

  const getDateString = (str) => {
    return moment.utc(str).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <>
      <Stack
        direction="row"
        sx={{ display: "flex", alignItems: "center", py: 3 }}
      >
        <Button
          onClick={() => {
            window.history.back();
          }}
        >
          <ArrowBackIosNew sx={{ mr: 1 }} />
        </Button>

        <Typography variant="h5">제안 목록</Typography>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {del.id}번 제안를 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            제안 삭제 시, 복원이 불가합니다.
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
            navigate("/proposal-create/" + params.id);
          }}
        >
          제안 추가
        </Button>
      </Stack>
      <TableContainer sx={{ py: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>사용자ID</TableCell>
              <TableCell>요청ID</TableCell>
              <TableCell>금액</TableCell>
              <TableCell>공사기간</TableCell>
              <TableCell>채택여부</TableCell>
              <TableCell>진행상태</TableCell>
              <TableCell>시간날짜</TableCell>
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
                      제안업체{item.uid}번
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      onClick={() => {
                        navigate("/request-detail/" + item.rid);
                      }}
                    >
                      {item.rid}번의뢰
                    </Link>
                  </TableCell>
                  <TableCell>{Number(item.price).toLocaleString()}</TableCell>
                  <TableCell>{item.duration}개월</TableCell>
                  <TableCell>{item.pick === 1 ? "채택" : "미채택"}</TableCell>
                  <TableCell>{getStage(item.stage)}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    {getDateString(item.updated)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => {
                        navigate("/proposal-detail/" + item.id);
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
