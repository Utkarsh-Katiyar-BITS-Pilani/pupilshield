import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5002/api/analytics")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load analytics"));
  }, []);

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }
  if (!data) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Students</Typography>
              <Typography variant="h5">{data.total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Vaccinated</Typography>
              <Typography variant="h5">
                {data.vaccinated} ({data.percent}%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Drives
              </Typography>
              {data.upcomingDrives.length > 0 ? (
                <Box component="ol" sx={{ pl: 2, m: 0 }}>
                  {data.upcomingDrives.map((d) => (
                    <Box component="li" key={d._id} sx={{ mb: 1 }}>
                      {d.vaccineName} on {new Date(d.date).toLocaleDateString()}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography>No upcoming drives</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
