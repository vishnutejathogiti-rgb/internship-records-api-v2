const express = require("express");
const cors = require("cors");
const recordsRouter = require("./routes/records");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Internship Records API",
    status: "ok",
    endpoints: {
      health: "/health",
      records: "/api/records"
    }
  });
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/records", recordsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Internship Records API listening on port ${PORT}`);
});
