const fs = require("fs");
const csvParser = require("csv-parser");
const Student = require("../models/Student");
const Drive = require("../models/Drive");

exports.getStudents = async (req, res) => {
  try {
    const filters = {};
    if (req.query.name) filters.name = new RegExp(req.query.name, "i");
    if (req.query.class) filters.class = req.query.class;
    if (req.query.vaccinated === "true") {
      filters["vaccinations.0"] = { $exists: true };
    }
    const students = await Student.find(filters);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, class: cls, studentId } = req.body;
    const student = new Student({ name, class: cls, studentId });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.class) updates.class = req.body.class;
    if (req.body.studentId) updates.studentId = req.body.studentId;

    const student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.vaccinateStudent = async (req, res) => {
  try {
    const { driveId, vaccineName } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ error: "Drive not found" });

    if (student.vaccinations.some((v) => v.drive.equals(driveId))) {
      return res
        .status(400)
        .json({ error: "Already vaccinated in this drive" });
    }

    student.vaccinations.push({
      drive: driveId,
      date: new Date(),
      vaccineName,
    });
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.bulkUploadStudents = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required" });
  }

  const filePath = req.file.path;
  const students = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          const { name, class: cls, studentId } = row;
          if (name && cls && studentId) {
            students.push({ name, class: cls, studentId });
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    const inserted = await Student.insertMany(students, { ordered: false });

    fs.unlinkSync(filePath);
    return res.json({
      insertedCount: inserted.length,
      attempted: students.length,
    });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (
      err.code === 11000 ||
      err.name === "MongoBulkWriteError" ||
      err.name === "BulkWriteError"
    ) {
      const insertedCount = err.result?.nInserted ?? 0;
      const errors = (err.writeErrors || []).map(
        (e) =>
          (e.err && (e.err.errmsg || e.err.message)) || "Unknown insert error"
      );
      return res.json({ insertedCount, errors });
    }
  }
};
