import App from "../../App.tsx";
import { createBrowserRouter } from "react-router-dom";
import Register from "../authentification/register/regsiterUi.tsx";
import NotFoundPage from "../NotFoundPage.tsx";
import ForgotPassword from "../authentification/forgotpassword/forgotPasswordui.tsx";
import ResetPassword from "../authentification/forgotpassword/resetPassword.tsx";
import { CampaignListPage } from "../campaigns/CampaignsPage.tsx";
import MainCampaignPage from "../campaigns/Campaigns.tsx";
import { JoinCampaign } from "../join/invite.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/campaigns/:campaignId",
    element: <MainCampaignPage />,
  },
  {
    path: "/campaigns",
    element: <CampaignListPage />,
  },
  {
    path: "/join/:token",
    element: <JoinCampaign />,
  },
]);
