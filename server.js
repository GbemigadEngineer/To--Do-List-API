const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

// Connect to the database
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection successful");
  });

// Set the port for the server to listen on
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  process.env.NODE_ENV === "production"
    ? console.log(`Server is running on port ${PORT}, in production mode`)
    : console.log(`Server is running on port ${PORT}, in development mode`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
