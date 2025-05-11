const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  vaccinateStudent,
  bulkUploadStudents,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/import", upload.single("file"), bulkUploadStudents);

router.route("/").get(getStudents).post(createStudent);

router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

router.post("/:id/vaccinate", vaccinateStudent);

module.exports = router;
