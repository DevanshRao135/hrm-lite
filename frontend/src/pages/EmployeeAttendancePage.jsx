import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
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
  const presentCount = rows.filter(
    (row) => row.status?.toLowerCase() === "present"
  ).length;
  const absentCount = rows.filter(
    (row) => row.status?.toLowerCase() === "absent"
  ).length;

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
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(135deg, rgba(14,116,144,0.10) 0%, rgba(59,130,246,0.08) 52%, rgba(251,191,36,0.10) 100%)",
            textAlign: "left",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "auto -50px -80px auto",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0) 70%)",
              pointerEvents: "none"
            }}
          />

          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
            >
              <Stack spacing={1.25}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: "0.18em",
                    fontWeight: 700,
                    color: "text.secondary"
                  }}
                >
                  Employee Attendance
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
                  {pageTitle}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontFamily: '"Aptos", "Segoe UI", sans-serif', maxWidth: 760 }}
                >
                  {pageSubtitle}
                </Typography>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  px: 2
                }}
              >
                Back to Employees
              </Button>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} useFlexGap flexWrap="wrap">
              <Chip
                icon={<BadgeOutlinedIcon />}
                label={`Employee ID: ${employeeId}`}
                sx={{
                  px: 1,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(8px)",
                  fontWeight: 600
                }}
              />
              <Chip
                icon={<CalendarMonthOutlinedIcon />}
                label={activeDateFilter ? `Filtered date: ${activeDateFilter}` : "Viewing full attendance history"}
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
                icon={<EventAvailableOutlinedIcon />}
                label="Present Days"
                size="small"
                sx={{ width: "fit-content", fontWeight: 700, bgcolor: "rgba(34,197,94,0.12)" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontSize: { xs: "1.8rem", md: "2.1rem" },
                  fontWeight: 700,
                  color: "text.primary"
                }}
              >
                {presentCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days currently marked as present for this employee.
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
                icon={<CalendarMonthOutlinedIcon />}
                label="Attendance Records"
                size="small"
                sx={{ width: "fit-content", fontWeight: 700, bgcolor: "rgba(251,191,36,0.18)" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontSize: { xs: "1.8rem", md: "2.1rem" },
                  fontWeight: 700,
                  color: "text.primary"
                }}
              >
                {rows.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total attendance entries saved for this employee.
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
              background: "linear-gradient(180deg, #ffffff 0%, #fdf5f5 100%)"
            }}
          >
            <Stack spacing={1}>
              <Chip
                icon={<EventAvailableOutlinedIcon />}
                label="Absent Days"
                size="small"
                sx={{ width: "fit-content", fontWeight: 700, bgcolor: "rgba(239,68,68,0.12)" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontSize: { xs: "1.8rem", md: "2.1rem" },
                  fontWeight: 700,
                  color: "text.primary"
                }}
              >
                {absentCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days currently marked as absent for this employee.
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
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)"
          }}
        >
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                fontWeight: 700,
                letterSpacing: "-0.02em"
              }}
            >
              Attendance Timeline
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Filter by date to inspect a single day, or keep the full history visible for a broader review.
            </Typography>
          </Stack>

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
