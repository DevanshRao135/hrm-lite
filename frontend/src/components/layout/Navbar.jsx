// src/components/layout/Navbar.jsx
import { AppBar, Toolbar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => navigate("/")}>
          Employees
        </Button>
        <Button color="inherit" onClick={() => navigate("/attendance")}>
          Attendance
        </Button>
      </Toolbar>
    </AppBar>
  );
}