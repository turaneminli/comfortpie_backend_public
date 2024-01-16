const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sensorSchema = new Schema(
  {
    temperature: Number,
    humidity: Number,
    flameSensor: Boolean,
    soundSensor: Number,
    lightIntensity: Number,
    carbonmonoxide: Boolean,
    roomNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

sensorSchema.index({ createdAt: -1 });

module.exports = mongoose.model("SensorData", sensorSchema);
