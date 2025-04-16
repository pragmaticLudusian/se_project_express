require("dotenv").config();
const { SERVER_PORT = 3001, DB_PORT = 27017 } = process.env;
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const routerIndex = require("./routes/index");

const app = express(); // middleware positioning - DOES matter

mongoose
  .connect(`mongodb://127.0.0.1:${DB_PORT}/wtwr_db`)
  .then(() => console.log(`connected to db in port ${DB_PORT}`))
  .catch(console.error);

app.use(express.json()); // w/out this, the req body will be empty
app.use(helmet()); // set default security headers

app.use("/", routerIndex); // either a clear const or a required filepath

app.listen(SERVER_PORT, () => {
  console.log(`app's now listening to port ${SERVER_PORT}`);
});
