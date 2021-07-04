import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import Users from "views/Users.js";
import Classes from "views/Classes";
import Semesters from "views/Semesters.js";
import Typography from "views/Typography.js";
import Logout from "views/Logout.js";
import Icons from "views/Icons.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users List",
    icon: "nc-icon nc-badge",
    component: Users,
    layout: "/admin",
  },
  {
    path: "/semesters",
    name: "Semesters List",
    icon: "nc-icon nc-alien-33",
    component: Semesters,
    layout: "/admin",
  },
  {
    path: "/classes",
    name: "Classes List",
    icon: "nc-icon nc-alien-33",
    component: Classes,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
  },
  {
    upgrade: true,
    path: "/logout",
    name: "Logout",
    icon: "nc-icon nc-button-power",
    component: Logout,
    layout: "/admin",
  },
];

export default dashboardRoutes;
