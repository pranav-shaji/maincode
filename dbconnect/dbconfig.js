const mongoose = require("mongoose");

let dbconnect = () => {
  mongoose
    .connect("mongodb://localhost:27017/book")
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { dbconnect };
