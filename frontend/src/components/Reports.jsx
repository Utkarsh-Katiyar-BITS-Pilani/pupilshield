// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Paper,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Alert,
// } from "@mui/material";

// export default function Reports() {
//   const [filters, setFilters] = useState({
//     vaccineName: "",
//     status: "all",
//     dateFrom: "",
//     dateTo: "",
//   });
//   const [reportData, setReportData] = useState([]);
//   const [error, setError] = useState("");
//   const API = "http://localhost:5002/api/reports";

//   const loadReport = async () => {
//     try {
//       const res = await axios.get(API, { params: filters });
//       setReportData(res.data);
//       setError("");
//     } catch {
//       setError("Failed to load report");
//     }
//   };

//   useEffect(() => {
//     loadReport();
//   }, []);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((f) => ({ ...f, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     loadReport();
//   };

//   const downloadCsvUrl = () => {
//     const params = new URLSearchParams({ ...filters, export: "csv" });
//     return `${API}?${params.toString()}`;
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Paper sx={{ p: 2, mb: 3 }}>
//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           sx={{ display: "grid", gap: 2 }}
//         >
//           <TextField
//             label="Vaccine Name"
//             name="vaccineName"
//             value={filters.vaccineName}
//             onChange={handleFilterChange}
//           />

//           <FormControl>
//             <InputLabel>Status</InputLabel>
//             <Select
//               name="status"
//               value={filters.status}
//               label="Status"
//               onChange={handleFilterChange}
//             >
//               <MenuItem value="all">All</MenuItem>
//               <MenuItem value="vaccinated">Vaccinated</MenuItem>
//               <MenuItem value="unvaccinated">Unvaccinated</MenuItem>
//             </Select>
//           </FormControl>

//           <TextField
//             label="Date From"
//             name="dateFrom"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             value={filters.dateFrom}
//             onChange={handleFilterChange}
//           />

//           <TextField
//             label="Date To"
//             name="dateTo"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             value={filters.dateTo}
//             onChange={handleFilterChange}
//           />

//           <Box sx={{ display: "flex", gap: 2 }}>
//             <Button variant="contained" type="submit">
//               Apply Filters
//             </Button>
//             <Button variant="outlined" href={downloadCsvUrl()}>
//               Download CSV
//             </Button>
//           </Box>
//         </Box>
//       </Paper>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <Paper sx={{ p: 2 }}>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Class</TableCell>
//                 <TableCell>Student ID</TableCell>
//                 <TableCell>Vaccine</TableCell>
//                 <TableCell>Date</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {reportData.map((r, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell>{r.name}</TableCell>
//                   <TableCell>{r.class}</TableCell>
//                   <TableCell>{r.studentId}</TableCell>
//                   <TableCell>{r.vaccineName || "-"}</TableCell>
//                   <TableCell>
//                     {r.date ? new Date(r.date).toLocaleDateString() : "-"}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Alert,
  Pagination,
} from "@mui/material";

export default function Reports() {
  const [filters, setFilters] = useState({
    vaccineName: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const API = "http://localhost:5002/api/reports";

  const loadReport = async () => {
    try {
      const res = await axios.get(API, { params: filters });
      setReportData(res.data);
      setError("");
      setCurrentPage(1); // reset to first page after new filter
    } catch {
      setError("Failed to load report");
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadReport();
  };

  const downloadCsvUrl = () => {
    const params = new URLSearchParams({ ...filters, export: "csv" });
    return `${API}?${params.toString()}`;
  };

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = reportData.slice(indexOfFirst, indexOfLast);
  const pageCount = Math.ceil(reportData.length / entriesPerPage);

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            label="Vaccine Name"
            name="vaccineName"
            value={filters.vaccineName}
            onChange={handleFilterChange}
          />

          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              label="Status"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="vaccinated">Vaccinated</MenuItem>
              <MenuItem value="unvaccinated">Unvaccinated</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Date From"
            name="dateFrom"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />

          <TextField
            label="Date To"
            name="dateTo"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateTo}
            onChange={handleFilterChange}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" type="submit">
              Apply Filters
            </Button>
            <Button variant="outlined" href={downloadCsvUrl()}>
              Download CSV
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Student ID</TableCell>
                <TableCell>Vaccine</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentEntries.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.class}</TableCell>
                  <TableCell>{r.studentId}</TableCell>
                  <TableCell>{r.vaccineName || "-"}</TableCell>
                  <TableCell>
                    {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Control */}
        {reportData.length > entriesPerPage && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
