const { PORT = 3001 } = process.env;
const express = require("express");
const mongoose = require("mongoose");
const routerIndex = require("./routes/index");

const app = express(); // middleware positioning - DOES matter

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("connected to db in port 27017"))
  .catch(console.error);

app.use(express.json()); // w/out this, the req body will be empty

app.use((req, res, next) => {
  req.user = {
    _id: "67e2d2b28a199f613799d971",
  };
  next();
});

app.use("/", routerIndex); // either a clear const or a required filepath

app.listen(PORT, () => {
  console.log(`app's now listening to port ${PORT}`);
});
