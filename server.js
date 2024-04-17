const express = require("express");
require("dotenv").config();
const app = express();

const port = process.env.PORT;
const { dbconnect } = require("../pranav3/dbconnect/dbconfig");
dbconnect();
app.use(express.json());

const cors = require("cors");


app.use(cors());
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("server connected on", port);
  }
});
