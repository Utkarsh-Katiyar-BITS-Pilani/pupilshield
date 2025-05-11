const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Drive",
  new mongoose.Schema(
    {
      vaccineName: String,
      date: Date,
      availableDoses: Number,
      applicableClasses: [String],
    },
    { timestamps: true }
  )
);
