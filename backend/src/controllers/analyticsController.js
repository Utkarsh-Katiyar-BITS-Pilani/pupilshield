const Student = require("../models/Student");
const Drive = require("../models/Drive");

exports.getAnalytics = async (req, res) => {
  const total = await Student.countDocuments();
  const vaccinated = await Student.countDocuments({
    "vaccinations.0": { $exists: true },
  });
  const percent = total ? ((vaccinated / total) * 100).toFixed(2) : 0;

  const now = new Date();
  const upcomingDrives = await Drive.find({ date: { $gte: now } }).sort("date");

  res.json({ total, vaccinated, percent, upcomingDrives });
};
