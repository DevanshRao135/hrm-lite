// src/components/employee/EmployeeTable.jsx
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

export default function EmployeeTable({ data, onDelete, loading = false, rangeLabel = "All Time" }) {
  const navigate = useNavigate();
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const handleViewAttendance = (employee) => {
    navigate(`/attendance/${employee.employee_id}`, {
      state: {
        employee
      }
    });
  };

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
  };

  const handleCloseDeleteDialog = () => {
    setEmployeeToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      onDelete(employeeToDelete.employee_id);
    }

    handleCloseDeleteDialog();
  };

  const columns = [
    { field: "employee_id", headerName: "Employee ID", flex: 1, minWidth: 140 },
    { field: "full_name", headerName: "Employee Name", flex: 1.2, minWidth: 180 },
    { field: "email", headerName: "Email Address", flex: 1.4, minWidth: 220 },
    { field: "department", headerName: "Department", flex: 1, minWidth: 160 },
    {
      field: "total_present_days",
      headerName: "Present Days",
      type: "number",
      flex: 0.8,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value ?? 0}
          size="small"
          color={(params.value ?? 0) > 0 ? "success" : "default"}
          variant={(params.value ?? 0) > 0 ? "filled" : "outlined"}
          sx={{ fontWeight: 600, minWidth: 48 }}
        />
      )
    },
    {
      field: "attendance",
      headerName: "Attendance",
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      width: 110,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleViewAttendance(params.row)}
          aria-label={`View attendance for ${params.row.full_name}`}
        >
          <VisibilityIcon />
        </IconButton>
      )
    },
    {
      field: "actions",
      headerName: "Delete",
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      width: 90,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row)}
          aria-label={`Delete ${params.row.full_name}`}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden"
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" }
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Aptos Display", "Trebuchet MS", "Segoe UI", sans-serif',
                fontWeight: 700,
                letterSpacing: "-0.02em"
              }}
            >
              Employee Directory
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: '"Aptos", "Segoe UI", sans-serif' }}
            >
              Present-day totals currently reflect the {rangeLabel.toLowerCase()} attendance window.
            </Typography>
          </Box>
          <Chip
            label={`${data.length} ${data.length === 1 ? "record" : "records"}`}
            sx={{
              fontWeight: 700,
              color: "text.primary",
              bgcolor: "rgba(14,116,144,0.08)",
              borderRadius: 999
            }}
          />
        </Stack>

        <DataGrid
          autoHeight
          loading={loading}
          rows={data}
          columns={columns}
          getRowId={(row) => row.employee_id}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0
              }
            }
          }}
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
              fontFamily: '"Aptos", "Segoe UI", sans-serif'
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
                  No employees found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your first employee to start tracking attendance.
                </Typography>
              </Stack>
            )
          }}
        />
      </Paper>

      <Dialog open={!!employeeToDelete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {employeeToDelete
              ? `Are you sure you want to delete ${employeeToDelete.full_name} (${employeeToDelete.employee_id})?`
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
