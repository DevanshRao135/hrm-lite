import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Stack, Typography } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

function formatAttendanceDate(value) {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

const columns = [
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    minWidth: 180,
    renderCell: (params) => (
      <Stack spacing={0.25}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontFamily: '"Aptos", "Segoe UI", sans-serif'
          }}
        >
          {formatAttendanceDate(params.value)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {params.value || "No date"}
        </Typography>
      </Stack>
    )
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 140,
    renderCell: (params) => {
      const normalizedStatus = params.value?.toLowerCase();
      const color =
        normalizedStatus === "present"
          ? "success"
          : normalizedStatus === "absent"
            ? "error"
            : "default";

      return (
        <Chip
          label={params.value || "Unknown"}
          size="small"
          color={color}
          variant={color === "default" ? "outlined" : "filled"}
          sx={{ fontWeight: 600, textTransform: "capitalize" }}
        />
      );
    }
  },
  {
    field: "comment",
    headerName: "Notes",
    flex: 2,
    minWidth: 260,
    renderCell: (params) => (
      params.value ? (
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            fontFamily: '"Aptos", "Segoe UI", sans-serif'
          }}
        >
          {params.value}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          No note added
        </Typography>
      )
    )
  }
];

export default function AttendanceTable({ rows }) {
  const presentRows = rows.filter(
    (row) => row.status?.toLowerCase() === "present"
  ).length;

  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        background: "rgba(255,255,255,0.72)"
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{
          px: { xs: 2, md: 2.5 },
          py: 1.75,
          borderBottom: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          background: "linear-gradient(180deg, rgba(248,250,252,0.9) 0%, rgba(241,245,249,0.72) 100%)"
        }}
      >
        <Stack spacing={0.35}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif'
            }}
          >
            Attendance Records
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review day-by-day status updates and supporting notes.
          </Typography>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
          <Chip
            icon={<CalendarMonthOutlinedIcon />}
            label={`${rows.length} ${rows.length === 1 ? "entry" : "entries"}`}
            size="small"
            sx={{ fontWeight: 700, bgcolor: "rgba(14,116,144,0.08)" }}
          />
          <Chip
            icon={<InsightsOutlinedIcon />}
            label={`${presentRows} present`}
            size="small"
            sx={{ fontWeight: 700, bgcolor: "rgba(34,197,94,0.12)" }}
          />
          <Chip
            icon={<NotesOutlinedIcon />}
            label={`${rows.filter((row) => row.comment).length} notes`}
            size="small"
            sx={{ fontWeight: 700, bgcolor: "rgba(251,191,36,0.18)" }}
          />
        </Stack>
      </Stack>

      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
              page: 0
            }
          }
        }}
        getRowId={(row) => `${row.employee_id}-${row.date}`}
        sx={{
          border: 0,
          minHeight: 420,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.96) 100%)",
          "& .MuiDataGrid-columnHeaders": {
            background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
            borderBottom: "1px solid",
            borderColor: "divider"
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            color: "text.primary",
            fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif'
          },
          "& .MuiDataGrid-cell": {
            borderColor: "divider",
            py: 1,
            display: "flex",
            alignItems: "center",
            fontFamily: '"Aptos", "Segoe UI", sans-serif'
          },
          "& .MuiDataGrid-row": {
            minHeight: 64
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(14,116,144,0.06)"
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid",
            borderColor: "divider"
          },
          "& .MuiDataGrid-overlay": {
            backgroundColor: "transparent"
          }
        }}
        slots={{
          noRowsOverlay: () => (
            <Stack
              sx={{ height: "100%" }}
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                No attendance records found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attendance entries will appear here once records are available.
              </Typography>
            </Stack>
          )
        }}
      />
    </Box>
  );
}
