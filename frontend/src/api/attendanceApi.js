// src/api/attendanceApi.js
import api from "./client";

export const markAttendance = (data) => api.post("/attendance/", data);
export const updateAttendance = (emp, date, data) =>
  api.put(`/attendance/${emp}/${date}`, data);
export const getAttendance = (emp) =>
  api.get(`/attendance/${emp}`);
