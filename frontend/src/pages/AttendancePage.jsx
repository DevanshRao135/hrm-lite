// src/pages/AttendancePage.jsx
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { markAttendance } from "../api/attendanceApi";
import { getEmployeeById } from "../api/employeeApi";

export default function AttendancePage() {
  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "Present",
    comment: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [searchingEmployee, setSearchingEmployee] = useState(false);
  const [foundEmployee, setFoundEmployee] = useState(null);
  const [employeeLookupError, setEmployeeLookupError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value
    }));

    if (field === "employee_id") {
      setFoundEmployee(null);
      setEmployeeLookupError("");
    }
  };

  const handleSearchEmployee = async () => {
    const employeeId = form.employee_id.trim();

    if (!employeeId) {
      setFoundEmployee(null);
      setEmployeeLookupError("Enter an employee ID before searching.");
      return;
    }

    setSearchingEmployee(true);
    setEmployeeLookupError("");

    try {
      const res = await getEmployeeById(employeeId);
      setFoundEmployee(res.data);
      setForm((current) => ({
        ...current,
        employee_id: employeeId
      }));
    } catch (error) {
      setFoundEmployee(null);
      setEmployeeLookupError(
        error.response?.data?.detail || "Employee not found."
      );
    } finally {
      setSearchingEmployee(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!foundEmployee) {
      setMessage({
        type: "error",
        text: "Search and select a valid employee before marking attendance."
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await markAttendance(form);

      if (res.data.error) {
        setMessage({
          type: "error",
          text: "Attendance is already marked for this employee and date."
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Attendance submitted successfully."
      });
      setFoundEmployee(null);
      setEmployeeLookupError("");
      setForm({
        employee_id: "",
        date: "",
        status: "Present",
        comment: ""
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.detail || "Unable to submit attendance right now."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          textAlign: "left"
        }}
      >
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1">
            Mark Attendance
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search for an employee first, then record the attendance date, status, and any optional note.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
              <TextField
                label="Employee ID"
                value={form.employee_id}
                onChange={handleChange("employee_id")}
                fullWidth
                required
                placeholder="Enter employee ID"
              />
              <Button
                variant="outlined"
                onClick={handleSearchEmployee}
                disabled={searchingEmployee}
                sx={{ minWidth: 150, height: 56 }}
              >
                {searchingEmployee ? <CircularProgress size={22} /> : "Search"}
              </Button>
            </Stack>

            {employeeLookupError ? (
              <Alert severity="error">{employeeLookupError}</Alert>
            ) : null}

            {foundEmployee ? (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "success.light",
                  bgcolor: "success.50"
                }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Employee Found
                  </Typography>
                  <Typography variant="body2">
                    Name: {foundEmployee.full_name}
                  </Typography>
                  <Typography variant="body2">
                    Email: {foundEmployee.email}
                  </Typography>
                  <Typography variant="body2">
                    Department: {foundEmployee.department}
                  </Typography>
                </Stack>
              </Paper>
            ) : null}

            <TextField
              label="Date"
              type="date"
              value={form.date}
              onChange={handleChange("date")}
              fullWidth
              required
              disabled={!foundEmployee}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth disabled={!foundEmployee}>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={handleChange("status")}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Comment"
              value={form.comment}
              onChange={handleChange("comment")}
              fullWidth
              multiline
              minRows={3}
              disabled={!foundEmployee}
              placeholder="Add a note if needed"
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" disabled={submitting || !foundEmployee}>
                {submitting ? "Submitting..." : "Submit Attendance"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={!!message.text}
        autoHideDuration={4000}
        onClose={() => setMessage({ type: "", text: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setMessage({ type: "", text: "" })}
          severity={message.type || "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
}
