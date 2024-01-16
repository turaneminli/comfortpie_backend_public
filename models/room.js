const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
    },
    nChairs: Number,
    nComputers: Number,
    nSockets: Number,
    nAvailableSockets: Number,
    additionalFacilities: String,
    nMarkerPens: Number,
    roomImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
