import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import Users from "views/Users.js";
import Classes from "views/Classes";
import Semesters from "views/Semesters.js";
import Logout from "views/Logout.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Statistical",
    icon: "nc-icon nc-chart-pie-36",
    component: Dashboard,
    permission: "admin",
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users List",
    icon: "nc-icon nc-badge",
    component: Users,
    permission: "admin",
    layout: "/admin",
  },
  {
    path: "/semesters",
    name: "Semesters List",
    icon: "nc-icon nc-alien-33",
    component: Semesters,
    permission: "admin",
    layout: "/admin",
  },
  {
    path: "/classes",
    name: "Classes List",
    icon: "nc-icon nc-layers-3",
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
    upgrade: true,
    path: "/logout",
    name: "Logout",
    icon: "nc-icon nc-button-power",
    component: Logout,
    layout: "/admin",
  },
];

export default dashboardRoutes;
