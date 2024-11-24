const express = require("express");
const pm2 = require("pm2");
const setSwagger = require('./swagger');



const app = express();
const port = 8080;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to PM2 Programmatic API
pm2.connect((err) => {
  if (err) {
    console.error("Error connecting to PM2:", err);
    process.exit(2);
  }
  console.log("Connected to PM2");
});

// Route to list all PM2 processes
app.get("/list", (req, res) => {
  pm2.list((err, processList) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve process list", details: err.message });
    }
    res.json(processList);
  });
});

// Route to start a new PM2 process
app.post("/start", (req, res) => {
  const { script, name, args } = req.body;

  if (!script || !name) {
    return res.status(400).json({ error: "Missing required fields: 'script' and 'name'" });
  }

  pm2.start(
    {
      script,
      name,
      args: args || [],
    },
    (err, proc) => {
      if (err) {
        return res.status(500).json({ error: "Failed to start process", details: err.message });
      }
      res.json({ message: "Process started", process: proc });
    }
  );
});

// Route to stop a PM2 process
app.post("/stop", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing required field: 'name'" });
  }

  pm2.stop(name, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to stop process", details: err.message });
    }
    res.json({ message: `Process '${name}' stopped` });
  });
});

// Route to delete a PM2 process
app.post("/delete", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing required field: 'name'" });
  }

  pm2.delete(name, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete process", details: err.message });
    }
    res.json({ message: `Process '${name}' deleted` });
  });
});

// Route to restart a PM2 process
app.post("/restart", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing required field: 'name'" });
  }

  pm2.restart(name, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to restart process", details: err.message });
    }
    res.json({ message: `Process '${name}' restarted` });
  });
});

// Route to reload all processes
app.post("/reload", (req, res) => {
  pm2.reload("all", (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to reload processes", details: err.message });
    }
    res.json({ message: "All processes reloaded" });
  });
});

// Error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  pm2.disconnect();
  process.exit(1);
});

// Start the HTTP server
app.listen(port, () => {
  console.log(`PM2 API Server running on http://localhost:${port}`);
});
