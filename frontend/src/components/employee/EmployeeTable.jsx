// src/components/employee/EmployeeTable.jsx
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

export default function EmployeeTable({ data, onDelete }) {
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
    { field: "employee_id", headerName: "ID", flex: 1 },
    { field: "full_name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    {
      field: "attendance",
      headerName: "Attendance",
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
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDelete(params.row)}>
          Delete
        </Button>
      )
    }
  ];

  return (
    <>
      <DataGrid rows={data} columns={columns} getRowId={(r) => r.employee_id} />

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
