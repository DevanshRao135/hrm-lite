// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";
import EmployeeAttendancePage from "./pages/EmployeeAttendancePage";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<EmployeesPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendance/:employeeId" element={<EmployeeAttendancePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
