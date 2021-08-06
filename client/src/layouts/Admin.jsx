import React from "react";
import { useLocation, useHistory, Route, Switch } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import sidebarImage from "assets/img/sidebar-3.jpg";

import auth from "services/authService";

import { socket, SocketContext } from "../services/socketIo";

function Admin() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const history = useHistory();
  const mainPanel = React.useRef(null);
  const [isFirstRender, setIsFirstRender] = React.useState(true);
  const getRoutes = (routes) => {
    if (auth.getCurrentUser().role !== "admin") {
      routes = routes.filter((x) => x.permission !== "admin");
    }
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);

  const constructor = () => {
    if (isFirstRender) {
      socket.on("deleteToken", (id) => {
        if (auth.getCurrentUser()._id === id) {
          history.replace("/admin/logout");
        }
      });
      socket.on("updateToken", (id, token) => {
        if (auth.getCurrentUser()._id === id) {
          localStorage.setItem("token", token);
          window.location.reload();
        }
      });
      setIsFirstRender(false);
    }
  };

  return (
    <SocketContext.Provider value={socket}>
      {constructor()}

      <div className="wrapper">
        <Sidebar
          color={color}
          image={hasImage ? image : ""}
          routes={
            auth.getCurrentUser().role !== "admin"
              ? routes.filter((x) => x.permission !== "admin")
              : routes
          }
        />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />

          <div className="content">
            <Switch>{getRoutes(routes)}</Switch>
          </div>
          <Footer />
        </div>
      </div>
      <FixedPlugin
        hasImage={hasImage}
        setHasImage={() => setHasImage(!hasImage)}
        color={color}
        setColor={(color) => setColor(color)}
        image={image}
        setImage={(image) => setImage(image)}
      />
    </SocketContext.Provider>
  );
}

export default Admin;
