import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    class: "",
    studentId: "",
  });
  const [selectedDrive, setSelectedDrive] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInput = useRef();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  const API = "http://localhost:5002/api/students";
  const DRIVES_API = "http://localhost:5002/api/drives";

  useEffect(() => {
    loadStudents();
    loadDrives();
  }, []);

  const loadStudents = () => {
    axios
      .get(API)
      .then((res) => setStudents(res.data))
      .catch(() => setError("Failed to load students"));
  };
  const loadDrives = () => {
    axios
      .get(DRIVES_API)
      .then((res) => {
        const now = new Date();
        setDrives(res.data.filter((d) => new Date(d.date) >= now));
      })
      .catch(() => console.error("Failed to load drives"));
  };

  const handleUpload = async () => {
    setMessage("");
    setError("");
    const file = fileInput.current.files[0];
    if (!file) return setError("Please select a CSV file.");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post(`${API}/import`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`Imported ${res.data.insertedCount} of ${res.data.attempted}`);
      loadStudents();
      setSelectedFileName("");
    } catch {
      setError("Import failed.");
    }
  };

  const openAddModal = () => {
    setFormState({ name: "", class: "", studentId: "" });
    setOpenAdd(true);
  };
  const openEditModal = (s) => {
    setCurrentStudent(s);
    setFormState({ name: s.name, class: s.class, studentId: s.studentId });
    setOpenEdit(true);
  };
  const openDeleteModal = (s) => {
    setCurrentStudent(s);
    setOpenDelete(true);
  };

  const handleAddSubmit = async () => {
    try {
      await axios.post(API, formState);
      setMessage("Student added");
      setOpenAdd(false);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || "Add failed");
    }
  };
  const handleEditSubmit = async () => {
    try {
      await axios.put(`${API}/${currentStudent._id}`, formState);
      setMessage("Student updated");
      setOpenEdit(false);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API}/${currentStudent._id}`);
      setMessage("Student deleted");
      setOpenDelete(false);
      loadStudents();
    } catch {
      setError("Delete failed");
    }
  };

  const handleVaccinate = async (id) => {
    const driveId = selectedDrive[id];
    if (!driveId) return setError("Select a drive");
    const drive = drives.find((d) => d._id === driveId);
    try {
      await axios.post(`${API}/${id}/vaccinate`, {
        driveId,
        vaccineName: drive.vaccineName,
      });
      setMessage("Vaccination recorded");
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || "Vaccination failed");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            accept=".csv"
            id="bulk-upload"
            type="file"
            style={{ display: "none" }}
            ref={fileInput}
            onChange={(e) => {
              const file = e.target.files[0];
              setSelectedFileName(file ? file.name : "");
            }}
          />
          <label htmlFor="bulk-upload">
            <Button variant="outlined" component="span">
              Select CSV
            </Button>
          </label>
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" color="primary" onClick={openAddModal}>
            Add Student
          </Button>
        </Box>
        {selectedFileName && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected file: {selectedFileName}
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Student ID</TableCell>
                <TableCell>Vaccination</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((s) => {
                const vaccinated = s.vaccinations.length > 0;
                return (
                  <TableRow key={s._id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.class}</TableCell>
                    <TableCell>{s.studentId}</TableCell>
                    <TableCell>
                      {vaccinated ? (
                        "✅ Vaccinated"
                      ) : (
                        <Box
                          sx={{ display: "flex", gap: 1, alignItems: "center" }}
                        >
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Drive</InputLabel>
                            <Select
                              label="Drive"
                              value={selectedDrive[s._id] || ""}
                              onChange={(e) =>
                                setSelectedDrive((sd) => ({
                                  ...sd,
                                  [s._id]: e.target.value,
                                }))
                              }
                            >
                              <MenuItem value="">None</MenuItem>
                              {drives.map((d) => (
                                <MenuItem key={d._id} value={d._id}>
                                  {d.vaccineName} on{" "}
                                  {new Date(d.date).toLocaleDateString()}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleVaccinate(s._id)}
                          >
                            Mark
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => openEditModal(s)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDeleteModal(s)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={formState.name}
            onChange={(e) =>
              setFormState((fs) => ({ ...fs, name: e.target.value }))
            }
          />
          <TextField
            label="Class"
            value={formState.class}
            onChange={(e) =>
              setFormState((fs) => ({ ...fs, class: e.target.value }))
            }
          />
          <TextField
            label="Student ID"
            value={formState.studentId}
            onChange={(e) =>
              setFormState((fs) => ({ ...fs, studentId: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={formState.name}
            onChange={(e) =>
              setFormState((fs) => ({ ...fs, name: e.target.value }))
            }
          />
          <TextField
            label="Class"
            value={formState.class}
            onChange={(e) =>
              setFormState((fs) => ({ ...fs, class: e.target.value }))
            }
          />
          <TextField
            label="Student ID"
            value={formState.studentId}
            onChange={(e) =>
              setFormState((fs) => ({ ...fs, studentId: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {currentStudent?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
