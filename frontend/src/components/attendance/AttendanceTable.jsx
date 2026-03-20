import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "date", headerName: "Date", flex: 1, minWidth: 140 },
  { field: "status", headerName: "Status", flex: 1, minWidth: 140 },
  { field: "comment", headerName: "Comment", flex: 2, minWidth: 220 }
];

export default function AttendanceTable({ rows }) {
  return (
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
    />
  );
}
