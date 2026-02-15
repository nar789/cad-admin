import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import {
  Home,
  MenuBook,
  Brush,
  Recycling,
  School,
  SportsEsports,
  CropPortrait,
  SmartToy,
  AttachMoney,
  Person,
  Campaign,
  Storefront,
  Assignment,
  Construction,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import UserListPage from "./UserListPage";
import NoticeList from "./NoticeList";
import BusinessInfo from "./BusinessInfo";
import RequestListPage from "./RequestListPage";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(false);
  const [tab, setTab] = useState(0);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const tabProps = (index) => {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  const id = window.localStorage.getItem("id");

  useEffect(() => {
    console.log("reload");
    document.body.style.backgroundColor = "white";

    if (id != null) {
      setIsLogin(true);
    } else {
      console.log("id is null");
    }
  }, []);

  return (
    <>
      {isLogin ? (
        <Container
          sx={{
            flex: 1,
            paddingBottom: 10,
            minHeight: 800,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
            <Tabs
              value={tab}
              onChange={handleChange}
              aria-label="tabs"
              textColor="primary"
              color="primary"
              indicatorColor="black"
              variant="fullWidth"
            >
              <Tab
                label="사용자관리"
                icon={<Person />}
                iconPosition="start"
                {...tabProps(0)}
              />
              <Tab
                label="의뢰 관리"
                icon={<Assignment />}
                iconPosition="start"
                {...tabProps(1)}
              />
              <Tab
                label="제안서 관리"
                icon={<Construction />}
                iconPosition="start"
                {...tabProps(2)}
              />
              <Tab
                label="공지사항"
                icon={<Campaign />}
                iconPosition="start"
                {...tabProps(3)}
              />
              <Tab
                label="사업자정보"
                icon={<Storefront />}
                iconPosition="start"
                {...tabProps(4)}
              />
            </Tabs>
          </Box>

          <TabPanel value={tab} index={0}>
            <UserListPage />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <RequestListPage />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <UserListPage />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <NoticeList />
          </TabPanel>
          <TabPanel value={tab} index={4}>
            <BusinessInfo />
          </TabPanel>
        </Container>
      ) : (
        <Box
          sx={{
            my: 10,
            display: "flex",
          }}
        >
          <Typography variant="h5">
            관리자 계정으로 로그인이 필요합니다.
          </Typography>
        </Box>
      )}
    </>
  );
}
