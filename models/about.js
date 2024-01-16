const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    whoAreWe: String,
    ourMision: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
