const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;
// Start the server
app.listen(PORT, () => {
  process.env.NODE_ENV === "production"
    ? console.log(`Server is running on port ${PORT}, in production mode`)
    : console.log(`Server is running on port ${PORT}, in development mode`);
});
