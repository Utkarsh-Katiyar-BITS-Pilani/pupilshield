import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Drives from "./components/Drives";
import Reports from "./components/Reports";

const pages = ["Dashboard", "Students", "Drives", "Reports"];
const settings = ["Logout"];
const subHeaders = {
  "/dashboard": "Dashboard Overview",
  "/students": "Student Management",
  "/drives": "Vaccination Drive Management",
  "/reports": "Vaccination Reports",
};

const PrivateRoute = ({ element, loggedIn }) => {
  return loggedIn ? element : <Navigate to="/" replace />;
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("loggedIn") === "true"
  );
  const username = localStorage.getItem("username") || "admin";

  const [authInitialized, setAuthInitialized] = useState(false);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "loggedIn") {
        setLoggedIn(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (loggedIn && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    } else if (!loggedIn && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
    setAuthInitialized(true);
  }, [loggedIn, navigate, location.pathname]);

  const handleLogin = (val) => {
    setLoggedIn(val);
    if (val) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", "admin");
    } else {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("username");
    }
  };

  const handleLogout = () => {
    handleLogin(false);
  };

  const handleOpenNavMenu = (e) => setAnchorElNav(e.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const subHeader = subHeaders[location.pathname] || "";

  if (!authInitialized) return null;

  return (
    <>
      {loggedIn && (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Pupil-Shield
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="navigation menu"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => {
                        handleCloseNavMenu();
                        navigate(`/${page.toLowerCase()}`);
                      }}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => navigate(`/${page.toLowerCase()}`)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={username}>{username.charAt(0)}</Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem disabled>
                    <Typography textAlign="center">{username}</Typography>
                  </MenuItem>
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        if (setting === "Logout") handleLogout();
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {loggedIn && subHeader && (
        <Box sx={{ bgcolor: "background.paper", py: 1, boxShadow: 1 }}>
          <Container>
            <Typography variant="h5">{subHeader}</Typography>
          </Container>
        </Box>
      )}

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute loggedIn={loggedIn} element={<Dashboard />} />
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute loggedIn={loggedIn} element={<Students />} />
            }
          />
          <Route
            path="/drives"
            element={<PrivateRoute loggedIn={loggedIn} element={<Drives />} />}
          />
          <Route
            path="/reports"
            element={<PrivateRoute loggedIn={loggedIn} element={<Reports />} />}
          />
          <Route
            path="*"
            element={<Navigate to={loggedIn ? "/dashboard" : "/"} replace />}
          />
        </Routes>
      </Container>
    </>
  );
}
