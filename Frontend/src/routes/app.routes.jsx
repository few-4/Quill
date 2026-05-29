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
import TextEditor from "../features/textDocument/pages/TextEditor";
import AuthGuard from "../features/auth/AuthGuard";
import GuestGuard from "../features/auth/GuestGuard";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Homepage,
  },
  {
    path: "sign-up",
    element: (
      <GuestGuard>
        <Register />
      </GuestGuard>
    ),
  },
  {
    path: "sign-in",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: "forgot-password",
    Component: ResetPassword,
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
    path: "workspace",
    element: (
      <AuthGuard>
        <Workspaceselect />
      </AuthGuard>
    ),
  },
  {
    element: (
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    ),
    children: [
      {
        path: "/dashboard/:workspaceId",
        Component: DashboardHome,
      },
      {
        path: "/documents/:workspaceId",
        Component: Documents,
      },
      {
        path: "/documents/:workspaceId/document/:documentId",
        Component: TextEditor,
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
