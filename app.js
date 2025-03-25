const { PORT = 3001 } = process.env;
const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json()); // w/out this, the req body will be empty

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.listen(PORT, () => {
  console.log(`app's now listening to port ${PORT}`);
});
