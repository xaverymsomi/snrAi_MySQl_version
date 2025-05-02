// app.js (ESM-compatible)
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import db from './config/db.js'; // make sure this file uses `export default db`
import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
