// src/api/employeeApi.js
import api from "./client";

export const getEmployees = (range = "all") =>
  api.get("/employees/", { params: { range } });
export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post("/employees/", data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
