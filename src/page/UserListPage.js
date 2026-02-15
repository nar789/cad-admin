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

export default function UserListPage() {
  const baseUrl = Config().baseUrl;
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(0);

  const navigate = useNavigate();

  const fetchUserList = () => {
    axios.post(baseUrl + "fetch/users", {}).then((res) => {
      if (res.data === "fail") {
        console.log("fail");
      } else {
        setList(res.data);
      }
    });
  };

  const deleteUser = () => {
    axios.post(baseUrl + "admin/delete/user", { id: del.id }).then((res) => {
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
          {del.userId}님을 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            회원 삭제 시, 복원이 불가합니다.
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
            navigate("/user-create");
          }}
        >
          사용자 추가
        </Button>
      </Stack>
      <TableContainer sx={{ py: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>아이디</TableCell>
              <TableCell>타입</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>주소</TableCell>
              <TableCell>폰번호</TableCell>
              <TableCell>추천인코드</TableCell>
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
                    {idx + 1}
                  </TableCell>
                  <TableCell>{item.userId}</TableCell>
                  <TableCell>
                    {item.company === "" ? "일반회원" : "시공업체"}
                  </TableCell>
                  <TableCell>
                    {item.company === "" ? item.name : item.company}
                  </TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => {
                        navigate("user-detail/" + item.id);
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
