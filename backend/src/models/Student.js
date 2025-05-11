const mongoose = require("mongoose");
const VaccinationSchema = new mongoose.Schema({
  drive: { type: mongoose.Schema.Types.ObjectId, ref: "Drive" },
  date: Date,
  vaccineName: String,
});
module.exports = mongoose.model(
  "Student",
  new mongoose.Schema({
    name: String,
    class: String,
    studentId: { type: String, unique: true },
    vaccinations: [VaccinationSchema],
  })
);
