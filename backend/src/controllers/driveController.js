const Drive = require("../models/Drive");

exports.getDrives = async (req, res) => {
  const drives = await Drive.find().sort("date");
  res.json(drives);
};

exports.createDrive = async (req, res) => {
  const { vaccineName, date, availableDoses, applicableClasses } = req.body;
  const driveDate = new Date(date);

  if (driveDate < Date.now() + 15 * 24 * 60 * 60 * 1000) {
    return res.status(400).json({ error: "Must schedule ≥15 days ahead" });
  }

  const conflict = await Drive.findOne({
    date: driveDate,
    applicableClasses: { $in: applicableClasses },
  });
  if (conflict) {
    return res.status(400).json({ error: "Date/class conflict" });
  }

  const drive = new Drive({
    vaccineName,
    date: driveDate,
    availableDoses,
    applicableClasses,
  });
  await drive.save();
  res.status(201).json(drive);
};

exports.updateDrive = async (req, res) => {
  const drive = await Drive.findById(req.params.id);
  if (!drive) return res.status(404).json({ error: "Drive not found" });

  if (new Date(drive.date) < Date.now()) {
    return res.status(400).json({ error: "Cannot edit past drives" });
  }

  Object.assign(drive, req.body);
  await drive.save();
  res.json(drive);
};

exports.deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndDelete(req.params.id);
    if (!drive) {
      return res.status(404).json({ error: "Drive not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("Delete drive error:", err);
    return res.status(500).json({ error: "Failed to delete drive" });
  }
};
