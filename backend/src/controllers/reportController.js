const Student = require("../models/Student");
const { Parser } = require("json2csv");

exports.getReports = async (req, res) => {
  try {
    const {
      vaccineName,
      status = "all",
      dateFrom,
      dateTo,
      export: exportFormat,
    } = req.query;

    const pipeline = [];

    if (status === "vaccinated") {
      pipeline.push({ $match: { "vaccinations.0": { $exists: true } } });
    } else if (status === "unvaccinated") {
      pipeline.push({ $match: { "vaccinations.0": { $exists: false } } });
    }

    pipeline.push({
      $unwind: {
        path: "$vaccinations",
        preserveNullAndEmptyArrays: true,
      },
    });

    if (vaccineName) {
      pipeline.push({
        $match: {
          "vaccinations.vaccineName": {
            $regex: new RegExp(`^${vaccineName}$`, "i"),
          },
        },
      });
    }

    if (dateFrom || dateTo) {
      const dateMatch = {};
      if (dateFrom) dateMatch.$gte = new Date(dateFrom);
      if (dateTo) dateMatch.$lte = new Date(dateTo);
      pipeline.push({ $match: { "vaccinations.date": dateMatch } });
    }

    pipeline.push({
      $project: {
        _id: 0,
        name: 1,
        class: 1,
        studentId: 1,
        vaccineName: "$vaccinations.vaccineName",
        date: "$vaccinations.date",
      },
    });

    const reportData = await Student.aggregate(pipeline);

    const formattedData = reportData.map((r) => ({
      ...r,
      date: r.date
        ? new Date(r.date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "",
    }));

    if (exportFormat === "csv") {
      const fields = ["name", "class", "studentId", "vaccineName", "date"];
      const parser = new Parser({ fields });
      const csv = parser.parse(formattedData);

      res.header("Content-Type", "text/csv");
      res.attachment("vaccination_report.csv");
      return res.send(csv);
    }

    res.json(reportData);
  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
