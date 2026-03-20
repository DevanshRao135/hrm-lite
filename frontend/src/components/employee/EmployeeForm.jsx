// src/components/employee/EmployeeForm.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField
} from "@mui/material";
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <TextField
              name="employee_id"
              label="Employee ID"
              value={form.employee_id}
              fullWidth
              required
              onChange={handleChange}
            />
            <TextField
              name="full_name"
              label="Full Name"
              value={form.full_name}
              fullWidth
              required
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={form.email}
              fullWidth
              required
              onChange={handleChange}
            />
            <TextField
              select
              name="department"
              label="Department"
              value={form.department}
              fullWidth
              required
              onChange={handleChange}
            >
              {DEPARTMENTS.map((dep) => (
                <MenuItem key={dep} value={dep}>
                  {dep}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
