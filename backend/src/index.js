require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db");
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  console.log("→ /health hit");
  res.send("OK");
});

app.use("/api/students", require("./routes/students"));
app.use("/api/drives", require("./routes/drives"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/reports", require("./routes/reports"));

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
