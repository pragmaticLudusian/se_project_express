require("dotenv").config();

const { SERVER_PORT = 3001, DB_PORT = 27017, JWT_SECRET } = process.env;
process.env.JWT_SECRET = JWT_SECRET || "default"; // use a default value if .env isn't set
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const routerIndex = require("./routes/index");

const app = express(); // middleware positioning - DOES matter

mongoose
  .connect(`mongodb://127.0.0.1:${DB_PORT}/wtwr_db`)
  .then(() => console.log(`connected to db in port ${DB_PORT}`)) // eslint-disable-line no-console
  .catch(console.error);

app.use(express.json()); // w/out this, the req body will be empty
app.use(helmet()); // set default security headers
app.use(cors());

app.use("/", routerIndex); // either a clear const or a required filepath

app.listen(SERVER_PORT, () => {
  console.log(`app's now listening to port ${SERVER_PORT}`); // eslint-disable-line no-console
});
