import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";

export default function Drives() {
  const [drives, setDrives] = useState([]);
  const [form, setForm] = useState({
    vaccineName: "",
    date: "",
    availableDoses: "",
    applicableClasses: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const API = "http://localhost:5002/api/drives";

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = () => {
    axios
      .get(API)
      .then((res) => setDrives(res.data))
      .catch(() => setError("Failed to load drives"));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm({
      vaccineName: "",
      date: "",
      availableDoses: "",
      applicableClasses: "",
    });
    setError("");
    setFormOpen(true);
  };
  const openEditForm = (d) => {
    setEditingId(d._id);
    setForm({
      vaccineName: d.vaccineName,
      date: d.date.slice(0, 10),
      availableDoses: String(d.availableDoses),
      applicableClasses: d.applicableClasses.join(","),
    });
    setError("");
    setFormOpen(true);
  };
  const closeForm = () => setFormOpen(false);

  const handleSubmit = async () => {
    setMessage("");
    setError("");
    const payload = {
      vaccineName: form.vaccineName,
      date: new Date(form.date).toISOString(),
      availableDoses: Number(form.availableDoses),
      applicableClasses: form.applicableClasses
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
        setMessage("Drive updated");
      } else {
        await axios.post(API, payload);
        setMessage("Drive created");
      }
      closeForm();
      loadDrives();
    } catch (err) {
      setError(err.response?.data?.error || "Save failed");
    }
  };

  const openDeleteConfirm = (id) => {
    setDeleteTarget(id);
    setDeleteOpen(true);
  };
  const closeDelete = () => setDeleteOpen(false);
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteTarget}`);
      setMessage("Drive deleted");
      closeDelete();
      loadDrives();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
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

      <Button variant="contained" sx={{ mb: 2 }} onClick={openCreateForm}>
        Create Drive
      </Button>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vaccine</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Doses</TableCell>
                <TableCell>Classes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drives.map((d) => {
                const isPast = new Date(d.date) < Date.now();
                return (
                  <TableRow key={d._id} sx={isPast ? { opacity: 0.6 } : {}}>
                    <TableCell>{d.vaccineName}</TableCell>
                    <TableCell>
                      {new Date(d.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{d.availableDoses}</TableCell>
                    <TableCell>{d.applicableClasses.join(", ")}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => openEditForm(d)}
                        disabled={isPast}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => openDeleteConfirm(d._id)}
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={formOpen} onClose={closeForm} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit Drive" : "Create Drive"}</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Vaccine Name"
            required
            value={form.vaccineName}
            onChange={(e) =>
              setForm((f) => ({ ...f, vaccineName: e.target.value }))
            }
          />
          <TextField
            label="Date"
            type="date"
            required
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          <TextField
            label="Available Doses"
            type="number"
            required
            value={form.availableDoses}
            onChange={(e) =>
              setForm((f) => ({ ...f, availableDoses: e.target.value }))
            }
          />
          <TextField
            label="Applicable Classes (comma‑sep)"
            required
            value={form.applicableClasses}
            onChange={(e) =>
              setForm((f) => ({ ...f, applicableClasses: e.target.value }))
            }
          />
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingId ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={closeDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this drive?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>No</Button>
          <Button color="error" onClick={confirmDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
