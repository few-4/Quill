import { createBrowserRouter } from "react-router";
import Homepage from "../pages/Homepage";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import VerifyOTP from "../features/auth/pages/VerifyOTP";
import Dashboard from "../features/dashboard/pages/Dashboard";
import DashboardHome from "../features/dashboard/pages/DashboardHome";
import Documents from "../features/dashboard/pages/Documents";
import TeamSpaces from "../features/dashboard/pages/TeamSpaces";
import Templates from "../features/dashboard/pages/Templates";
import Settings from "../features/dashboard/pages/Settings";
import ProtectedOTP from "../features/auth/ProtectedOTP";
import ResetPassword from "../features/auth/pages/ResetPassword";
import Workspaceselect from "../features/workspace/pages/Workspaceselect";
import { workspaceLoader } from "../features/workspace/Loaders/WorkspaceLoader";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Homepage,
  },
  {
    path: "sign-up",
    Component: Register,
  },
  {
    path: "sign-in",
    Component: Login,
  },
  {
    path: "forgot-password",
    Component: ResetPassword
  },
  {
    path: "verify-otp",
    element: (
      <ProtectedOTP>
        <VerifyOTP />
      </ProtectedOTP>
    ),
  },
  {
    path: 'workspace',
    Component: Workspaceselect,
    loader: workspaceLoader
  },
  // {
  //   path: "/dashboard/:workspaceId",
  //   Component: Dashboard,
  //   children: [
  //     {
  //       index: true,
  //       Component: DashboardHome
  //     }
  //   ]
  // }
  {
    Component: Dashboard,
    children: [
      {
        index: true,
        path: "/dashboard/:workspaceId",
        Component: DashboardHome,
      },
      {
        path: "/documents/:workspaceId",
        Component: Documents,
      },
      {
        path: "/document/:documentId",
        Component: DocumentPage
      },
      {
        path: "/team-spaces/:workspaceId",
        Component: TeamSpaces,
      },
      {
        path: "/templates/:workspaceId",
        Component: Templates,
      },
      {
        path: "/settings/:workspaceId",
        Component: Settings,
      },
    ],
  },
]);

export default router;
