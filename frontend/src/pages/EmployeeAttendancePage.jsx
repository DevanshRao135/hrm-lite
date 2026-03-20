import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AttendanceTable from "../components/attendance/AttendanceTable";
import { getAttendance } from "../api/attendanceApi";

export default function EmployeeAttendancePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId } = useParams();
  const employee = location.state?.employee;
  const [selectedDate, setSelectedDate] = useState("");
  const [activeDateFilter, setActiveDateFilter] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["attendance", employeeId],
    queryFn: () => getAttendance(employeeId),
    enabled: !!employeeId
  });

  const rows = data?.data || [];
  const filteredRows = useMemo(() => {
    if (!activeDateFilter) {
      return rows;
    }

    return rows.filter((row) => row.date === activeDateFilter);
  }, [activeDateFilter, rows]);
  const pageTitle = employee?.full_name || employeeId;
  const pageSubtitle = employee?.department
    ? `${employee.department} | ${employee.email}`
    : "Attendance history for the selected employee";

  const handleSearchByDate = () => {
    setActiveDateFilter(selectedDate);
  };

  const handleResetDateFilter = () => {
    setSelectedDate("");
    setActiveDateFilter("");
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Stack spacing={1}>
            <Typography variant="h4" component="h1">
              Employee Attendance
            </Typography>
            <Typography variant="h6">
              {pageTitle}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {pageSubtitle}
            </Typography>
          </Stack>

          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
            Back to Employees
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mb: 3 }}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              label="Filter by date"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: "100%", md: 220 } }}
            />
            <Button variant="contained" onClick={handleSearchByDate}>
              Search
            </Button>
            <Button variant="outlined" onClick={handleResetDateFilter} disabled={!selectedDate && !activeDateFilter}>
              Reset
            </Button>
            {activeDateFilter ? (
              <Typography variant="body2" color="text.secondary">
                Showing attendance for {activeDateFilter}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Showing all attendance records
              </Typography>
            )}
          </Stack>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Alert severity="error">
              {error.response?.data?.detail || "Unable to load attendance records."}
            </Alert>
          ) : rows.length === 0 ? (
            <Alert severity="info">No attendance records found for this employee.</Alert>
          ) : filteredRows.length === 0 ? (
            <Alert severity="info">No attendance records found for the selected date.</Alert>
          ) : (
            <AttendanceTable rows={filteredRows} />
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
