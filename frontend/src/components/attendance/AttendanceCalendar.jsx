// src/components/attendance/AttendanceCalendar.jsx
import { Box, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useQuery } from "@tanstack/react-query";
import { getAttendance } from "../../api/attendanceApi";

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AttendanceCalendar({ employeeId, open, onClose }) {
  const { data } = useQuery({
    queryKey: ["attendance", employeeId],
    queryFn: () => getAttendance(employeeId),
    enabled: open && !!employeeId
  });

  const attendanceDates = data?.data || [];

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = formatLocalDate(date);
      const attendance = attendanceDates.find((att) => att.date === dateStr);

      if (attendance) {
        return attendance.status?.toLowerCase() === "present"
          ? "attendance-present"
          : "attendance-absent";
      }
    }

    return null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Attendance Calendar</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "stretch" }}>
            Green dates indicate present records and red dates indicate absences.
          </Typography>

          <Calendar
            tileClassName={tileClassName}
            value={new Date()}
            className="attendance-calendar"
          />

          <Stack direction="row" spacing={2} sx={{ alignSelf: "stretch", flexWrap: "wrap" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box className="attendance-calendar__legend attendance-present" />
              <Typography variant="body2">Present</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box className="attendance-calendar__legend attendance-absent" />
              <Typography variant="body2">Absent</Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
