import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
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
import dayjs from "dayjs";
import DateUtil from "../DateUtil";

export default function NoticeList() {
  const baseUrl = Config().baseUrl;
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(0);

  const navigate = useNavigate();

  const fetchNoticeList = () => {
    axios.post(baseUrl + "admin/fetch/notice", {}).then((res) => {
      if (res.data === "fail") {
        console.log("fail");
      } else {
        setList(res.data);
      }
    });
  };

  const deleteUser = () => {
    axios.post(baseUrl + "admin/delete/notice", { id: del.id }).then((res) => {
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

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchNoticeList();
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
          [{decodeURIComponent(del.title)}]를 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            [{decodeURIComponent(del.title)}]를 삭제하시겠습니까?
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
          onClick={() => {
            navigate("/notice-write");
          }}
        >
          새로 작성
        </Button>
      </Stack>
      <Stack
        direction={"row"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TableContainer sx={{ py: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>내용</TableCell>
                <TableCell>마지막 업데이트</TableCell>
                <TableCell align="right">수정</TableCell>
                <TableCell align="right">삭제</TableCell>
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
                      {idx + 1}
                    </TableCell>
                    <TableCell>{decodeURIComponent(item.title)}</TableCell>
                    <TableCell>
                      <Button
                        size="large"
                        fullWidth
                        variant="contained"
                        onClick={() => navigate("/notice-detail/" + item.id)}
                      >
                        내용보기
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={13}>
                        {DateUtil().displayDatetime(item.updated)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => navigate("/notice-update/" + item.id)}
                      >
                        수정
                      </Button>
                    </TableCell>
                    <TableCell align="right">
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
      </Stack>
    </>
  );
}
