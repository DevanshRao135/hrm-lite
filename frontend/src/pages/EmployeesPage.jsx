// src/pages/EmployeesPage.jsx
import { useState } from "react";
import { Button, Container, Snackbar } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

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
    <Container>
      <Button onClick={() => setOpen(true)}>Add Employee</Button>

      <EmployeeTable
        data={data?.data || []}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

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
        message={error}
      />
    </Container>
  );
}
