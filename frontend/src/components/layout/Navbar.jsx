// src/components/layout/Navbar.jsx
import {
  AppBar,
  Box,
  Button,
  Chip,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const appName = import.meta.env.VITE_APP_NAME || "HRMS Lite";

  const navItems = [
    {
      label: "Employees",
      path: "/",
      icon: <DashboardCustomizeOutlinedIcon sx={{ fontSize: 18 }} />,
      active: location.pathname === "/" || location.pathname.startsWith("/attendance/")
    },
    {
      label: "Attendance",
      path: "/attendance",
      icon: <EventAvailableOutlinedIcon sx={{ fontSize: 18 }} />,
      active: location.pathname === "/attendance"
    }
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        bgcolor: "rgba(255,255,255,0.86)",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(16px)"
      }}
    >
      <Toolbar
        sx={{
          minHeight: 78,
          px: { xs: 2, md: 3 },
          justifyContent: "space-between",
          gap: 2
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #0f766e 0%, #155e75 100%)",
              color: "white",
              boxShadow: "0 14px 28px rgba(15, 118, 110, 0.18)"
            }}
          >
            <Groups2OutlinedIcon />
          </Box>
          <Box sx={{ textAlign: "left" }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "text.secondary",
                fontWeight: 700
              }}
            >
              {appName}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                fontWeight: 700,
                fontSize: { xs: "1rem", md: "1.15rem" },
                letterSpacing: "-0.02em"
              }}
            >
              People and attendance hub
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{
                px: 1.75,
                py: 1,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                color: item.active ? "white" : "text.primary",
                background: item.active
                  ? "linear-gradient(135deg, #0f766e 0%, #155e75 100%)"
                  : "rgba(15, 23, 42, 0.04)",
                border: item.active ? "none" : "1px solid rgba(148, 163, 184, 0.24)",
                boxShadow: item.active ? "0 10px 24px rgba(21, 94, 117, 0.18)" : "none",
                "&:hover": {
                  background: item.active
                    ? "linear-gradient(135deg, #0d6b64 0%, #164e63 100%)"
                    : "rgba(15, 23, 42, 0.08)"
                }
              }}
            >
              {item.label}
            </Button>
          ))}

          <Chip
            label="Admin"
            size="small"
            sx={{
              ml: { xs: 0, md: 1 },
              display: { xs: "none", sm: "inline-flex" },
              fontWeight: 700,
              color: "#155e75",
              bgcolor: "rgba(20, 184, 166, 0.10)",
              borderRadius: 999
            }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
