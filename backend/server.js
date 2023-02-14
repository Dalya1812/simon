const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9090;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let bestScore = 0;

app.post("/api/game-status", (req, res) => {
  const { score, bestScore } = req.body;
  console.log(`Score: ${score}`);
  console.log(`Best Score: ${bestScore}`);
  // Save the score and best score in a database or update the current best score if needed.
  res.status(200).json({ message: "Score saved successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

