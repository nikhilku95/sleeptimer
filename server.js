const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3000;

// Add basic security headers
app.use(helmet());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API to calculate sleep times
app.get('/api/sleep', (req, res) => {
  const { time, mode } = req.query;
  if (!time || !mode) return res.status(400).json({ error: 'Missing parameters' });

  const [hour, minute] = time.split(':').map(Number);
  const baseTime = new Date();
  baseTime.setHours(hour, minute, 0);

  const cycleMinutes = 90;
  const buffer = 14;
  const results = [];

  for (let i = 6; i >= 1; i--) {
    let total = i * cycleMinutes + buffer;
    let target = new Date(baseTime.getTime());
    if (mode === "wake") {
      target.setMinutes(target.getMinutes() - total);
    } else {
      target.setMinutes(target.getMinutes() + total);
    }
    results.push(target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }

  res.json({ results });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});