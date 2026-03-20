// src/components/employee/EmployeeForm.jsx
import { useState } from "react";
import {
  DialogActions,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { DEPARTMENTS } from "../../constants/departments";

export default function EmployeeForm({ open, onClose, onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      employee_id: form.employee_id.trim(),
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      department: form.department.trim()
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack spacing={0.75}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
              fontWeight: 700,
              letterSpacing: "-0.02em"
            }}
          >
            Add a new employee
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Capture the essential profile details so attendance can be tracked right away.
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.25}>
            <TextField
              name="employee_id"
              label="Employee ID"
              value={form.employee_id}
              fullWidth
              required
              onChange={handleChange}
              placeholder="EMP-1001"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              name="full_name"
              label="Employee Name"
              value={form.full_name}
              fullWidth
              required
              onChange={handleChange}
              placeholder="Aarav Sharma"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              name="email"
              label="Work Email"
              type="email"
              value={form.email}
              fullWidth
              required
              onChange={handleChange}
              placeholder="aarav@company.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              select
              name="department"
              label="Department"
              value={form.department}
              fullWidth
              required
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessCenterOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            >
              {DEPARTMENTS.map((dep) => (
                <MenuItem key={dep} value={dep}>
                  {dep}
                </MenuItem>
              ))}
            </TextField>

            <DialogActions sx={{ px: 0, pt: 1 }}>
              <Button onClick={onClose} color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  px: 2.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  background: "linear-gradient(135deg, #0f766e 0%, #155e75 100%)"
                }}
              >
                {submitting ? "Saving..." : "Create Employee"}
              </Button>
            </DialogActions>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
