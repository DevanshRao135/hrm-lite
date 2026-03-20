// src/pages/AttendancePage.jsx
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
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
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
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
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(135deg, rgba(14,116,144,0.10) 0%, rgba(34,197,94,0.08) 45%, rgba(251,191,36,0.10) 100%)",
            textAlign: "left",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "auto -40px -80px auto",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 70%)",
              pointerEvents: "none"
            }}
          />

          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                  color: "text.secondary"
                }}
              >
                Attendance Workflow
              </Typography>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontWeight: 700,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  color: "text.primary",
                  maxWidth: 760,
                  fontSize: { xs: "2rem", md: "3rem" }
                }}
              >
                Record attendance with a cleaner, faster check-in flow.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 760,
                  color: "text.secondary",
                  fontFamily: '"Aptos", "Segoe UI", sans-serif',
                  fontSize: { xs: "0.98rem", md: "1.05rem" }
                }}
              >
                Search by employee ID, confirm the person, then log the day's status with optional context for your team.
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} useFlexGap flexWrap="wrap">
              <Chip
                icon={<PersonSearchOutlinedIcon />}
                label={foundEmployee ? `Ready for ${foundEmployee.full_name}` : "Search an employee to begin"}
                sx={{
                  px: 1,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(8px)",
                  fontWeight: 600
                }}
              />
              <Chip
                icon={<EventAvailableOutlinedIcon />}
                label={form.date ? `Selected date: ${form.date}` : "Choose a date before submitting"}
                sx={{
                  px: 1,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(8px)",
                  fontWeight: 600
                }}
              />
            </Stack>
          </Stack>
        </Paper>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "left",
              background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)"
            }}
          >
            <Stack spacing={1}>
              <Chip
                icon={<PersonSearchOutlinedIcon />}
                label="Step 1"
                size="small"
                sx={{ width: "fit-content", fontWeight: 700, bgcolor: "rgba(14,116,144,0.08)" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontSize: { xs: "1.2rem", md: "1.35rem" },
                  fontWeight: 700,
                  color: "text.primary"
                }}
              >
                Find the employee
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search by employee ID to confirm you are marking attendance for the right person.
              </Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "left",
              background: "linear-gradient(180deg, #ffffff 0%, #fffaf1 100%)"
            }}
          >
            <Stack spacing={1}>
              <Chip
                icon={<EventAvailableOutlinedIcon />}
                label="Step 2"
                size="small"
                sx={{ width: "fit-content", fontWeight: 700, bgcolor: "rgba(251,191,36,0.18)" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontSize: { xs: "1.2rem", md: "1.35rem" },
                  fontWeight: 700,
                  color: "text.primary"
                }}
              >
                Set the attendance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pick a date, assign status, and add a short note when the record needs extra context.
              </Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "left",
              background: "linear-gradient(180deg, #ffffff 0%, #f4fbf5 100%)"
            }}
          >
            <Stack spacing={1}>
              <Chip
                icon={<FactCheckOutlinedIcon />}
                label="Step 3"
                size="small"
                sx={{ width: "fit-content", fontWeight: 700, bgcolor: "rgba(34,197,94,0.12)" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontSize: { xs: "1.2rem", md: "1.35rem" },
                  fontWeight: 700,
                  color: "text.primary"
                }}
              >
                Submit with confidence
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The form stays locked until an employee is verified, which helps prevent incorrect entries.
              </Typography>
            </Stack>
          </Paper>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "left",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)"
          }}
        >
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                fontWeight: 700,
                letterSpacing: "-0.02em"
              }}
            >
              Mark Attendance
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete the search first, then fill out the attendance details below.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
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
                  startIcon={!searchingEmployee ? <PersonSearchOutlinedIcon /> : null}
                  sx={{
                    minWidth: 170,
                    height: 56,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700
                  }}
                >
                  {searchingEmployee ? <CircularProgress size={22} /> : "Search Employee"}
                </Button>
              </Stack>

              {employeeLookupError ? (
                <Alert severity="error" variant="filled">{employeeLookupError}</Alert>
              ) : null}

              {foundEmployee ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: "success.light",
                    bgcolor: "success.50"
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Employee Confirmed
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

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
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
              </Stack>

              <TextField
                label="Comment"
                value={form.comment}
                onChange={handleChange("comment")}
                fullWidth
                multiline
                minRows={4}
                disabled={!foundEmployee}
                placeholder="Add a note if needed"
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || !foundEmployee}
                  startIcon={!submitting ? <FactCheckOutlinedIcon /> : null}
                  sx={{
                    minHeight: 46,
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    background: "linear-gradient(135deg, #0f766e 0%, #155e75 100%)"
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Attendance"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Stack>

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
