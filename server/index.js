const express = require("express");
const app = express();
const cors = require("cors");
// Middleware

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Add limit to prevent large payload issues

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

// Routes
// Register and login routes
app.use("/auth", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/profile", require("./routes/profile"));
// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});