const express = require("express");
const { randomUUID } = require("crypto");

const router = express.Router();

// Starter storage: records are kept in memory and reset when the server restarts.
// Use a database for production/persistent records.
const records = [];

router.get("/", (_req, res) => {
  res.json({ count: records.length, data: records });
});

router.get("/:id", (req, res) => {
  const record = records.find((item) => item.id === req.params.id);
  if (!record) return res.status(404).json({ error: "Record not found" });
  res.json(record);
});

router.post("/", (req, res) => {
  const { studentName, company, role, startDate, endDate, status } = req.body || {};
  if (!studentName || !company || !role) {
    return res.status(400).json({
      error: "studentName, company, and role are required"
    });
  }

  const record = {
    id: randomUUID(),
    studentName: String(studentName).trim(),
    company: String(company).trim(),
    role: String(role).trim(),
    startDate: startDate || null,
    endDate: endDate || null,
    status: status || "applied",
    createdAt: new Date().toISOString()
  };

  records.push(record);
  res.status(201).json(record);
});

router.put("/:id", (req, res) => {
  const index = records.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Record not found" });

  const allowed = ["studentName", "company", "role", "startDate", "endDate", "status"];
  const updated = { ...records[index] };
  for (const key of allowed) {
    if (req.body && req.body[key] !== undefined) updated[key] = req.body[key];
  }
  records[index] = updated;
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const index = records.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Record not found" });
  const [deleted] = records.splice(index, 1);
  res.json({ message: "Record deleted", data: deleted });
});

module.exports = router;
