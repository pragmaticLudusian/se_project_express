const { PORT = 3001 } = process.env;
const express = require("express");
const mongoose = require("mongoose");

const app = express(); // middleware positioning - DOES matter

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json()); // w/out this, the req body will be empty

app.use((req, res, next) => {
  req.user = {
    _id: "67e2d2b28a199f613799d971",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.listen(PORT, () => {
  console.log(`app's now listening to port ${PORT}`);
});
