import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import HomePage from "./page/HomePage";
import UserDetailPage from "./page/UserDetailPage";
import NoticeWrite from "./page/NoticeWrite";
import NoticeDetail from "./page/NoticeDetail";
import NoticeUpdate from "./page/NoticeUpdate";
import UserCreatePage from "./page/UserCreatePage";
import RequestDetailPage from "./page/RequestDetailPage";
import RequestCreatePage from "./page/RequestCreatePage";
import ProposalListPage from "./page/ProposalListPage";
import ProposalDetailPage from "./page/ProposalDetailPage";
import ProposalCreatePage from "./page/ProposalCreatePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    //    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/:tab",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "user-detail/:id",
        element: <UserDetailPage />,
      },
      {
        path: "user-create",
        element: <UserCreatePage />,
      },
      {
        path: "notice-write",
        element: <NoticeWrite />,
      },
      {
        path: "notice-detail/:id",
        element: <NoticeDetail />,
      },
      {
        path: "notice-update/:id",
        element: <NoticeUpdate />,
      },
      {
        path: "request-detail/:id",
        element: <RequestDetailPage />,
      },
      {
        path: "request-create",
        element: <RequestCreatePage />,
      },
      {
        path: "proposal/:id",
        element: <ProposalListPage />,
      },
      {
        path: "proposal-detail/:id",
        element: <ProposalDetailPage />,
      },
      {
        path: "proposal-create/:id",
        element: <ProposalCreatePage />,
      },
      /*
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "company",
        element: <CompanyPage />,
      },*/
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
//root.render(<App />);
