const express = require("express");
const router = express.Router();
const {
  getDrives,
  createDrive,
  updateDrive,
  deleteDrive,
} = require("../controllers/driveController");

router.route("/").get(getDrives).post(createDrive);

router.route("/:id").put(updateDrive);

router.delete("/:id", deleteDrive);

module.exports = router;
