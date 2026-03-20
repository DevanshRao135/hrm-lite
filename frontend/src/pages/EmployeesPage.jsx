// src/pages/EmployeesPage.jsx
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Typography
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";

import { getEmployees, createEmployee, deleteEmployee } from "../api/employeeApi";
import EmployeeForm from "../components/employee/EmployeeForm";
import EmployeeTable from "../components/employee/EmployeeTable";

function getApiErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc) ? item.loc.at(-1) : "field";
        return `${field}: ${item.msg}`;
      })
      .join(", ");
  }

  return detail || "Unable to complete the request.";
}

export default function EmployeesPage() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState("all");

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employees", range],
    queryFn: () => getEmployees(range)
  });

  const employees = data?.data || [];
  const rangeLabel = {
    all: "All Time",
    this_week: "This Week",
    this_month: "This Month"
  }[range];
  const totalPresentDays = employees.reduce(
    (sum, employee) => sum + (employee.total_present_days || 0),
    0
  );

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setOpen(false);
      setError("");
    },
    onError: (err) => setError(getApiErrorMessage(err))
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
    onError: (err) => setError(getApiErrorMessage(err))
  });

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(135deg, rgba(14,116,144,0.10) 0%, rgba(251,191,36,0.12) 52%, rgba(15,23,42,0.04) 100%)",
            textAlign: "left",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "auto -60px -80px auto",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
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
                Workforce Dashboard
              </Typography>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: "text.primary",
                  maxWidth: 760,
                  fontSize: { xs: "2rem", md: "3rem" }
                }}
              >
                Keep your employee roster and attendance trends in one polished workspace.
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
                Review active employees, switch attendance windows instantly, and jump into an individual history without losing the overview.
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} useFlexGap flexWrap="wrap">
              <Chip
                icon={<Groups2OutlinedIcon />}
                label={`${employees.length} active ${employees.length === 1 ? "employee" : "employees"}`}
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
                label={`Attendance window: ${rangeLabel}`}
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
                icon={<Groups2OutlinedIcon />}
                label="Team Snapshot"
                size="small"
                sx={{ width: "fit-content", fontWeight: 700, bgcolor: "rgba(14,116,144,0.08)" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontSize: { xs: "1.8rem", md: "2.1rem" },
                  fontWeight: 700,
                  color: "text.primary"
                }}
              >
                {employees.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active employees currently listed in your directory.
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
                icon={<InsightsOutlinedIcon />}
                label="Presence Total"
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
                {totalPresentDays}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Combined present-day marks across the {rangeLabel.toLowerCase()} window.
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
                icon={<TodayOutlinedIcon />}
                label="Active Filter"
                size="small"
                sx={{ width: "fit-content", fontWeight: 700, bgcolor: "rgba(34,197,94,0.12)" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontSize: { xs: "1.35rem", md: "1.55rem" },
                  fontWeight: 700,
                  color: "text.primary"
                }}
              >
                {rangeLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Switch the range any time to compare recent attendance trends.
              </Typography>
            </Stack>
          </Paper>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "left",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)"
          }}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", lg: "center" } }}
          >
            <Stack spacing={0.5}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                  fontWeight: 700
                }}
              >
                Employee Directory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the attendance filter to compare short-term presence without leaving the table.
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="present-days-range-label">Attendance Range</InputLabel>
                <Select
                  labelId="present-days-range-label"
                  value={range}
                  label="Attendance Range"
                  onChange={(event) => setRange(event.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="this_week">This Week</MenuItem>
                  <MenuItem value="this_month">This Month</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<PersonAddAlt1OutlinedIcon />}
                sx={{
                  minHeight: 44,
                  px: 2.75,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  background: "linear-gradient(135deg, #0f766e 0%, #155e75 100%)"
                }}
              >
                Add Employee
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {isError ? (
          <Alert severity="error">Unable to load employees right now.</Alert>
        ) : (
          <EmployeeTable
            data={employees}
            loading={isLoading}
            rangeLabel={rangeLabel}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        )}
      </Stack>

      <EmployeeForm
        open={open}
        onClose={() => setOpen(false)}
        submitting={createMutation.isPending}
        onSubmit={(form) => createMutation.mutate(form)}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
