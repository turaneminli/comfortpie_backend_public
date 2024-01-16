const SensorData = require("../models/sensorData");
const axios = require("axios");

exports.temperatureReport = async (req, res) => {
  const data = await SensorData.aggregate([
    {
      $match: {
        temperature: { $exists: true },
        roomNumber: req.query.roomNumber,
      },
    },
    {
      $group: {
        _id: {
          $floor: {
            $divide: [
              { $subtract: ["$createdAt", new Date(0)] },
              req.query.minutes * 60 * 1000, // 25 minute in milliseconds
            ],
          },
        },
        averageTemperature: { $avg: "$temperature" },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $limit: 24,
    },
  ]);
  console.log(data.length);
  res.status(200).json(data);
};

exports.humidityReport = async (req, res) => {
  const data = await SensorData.aggregate([
    {
      $match: {
        humidity: { $exists: true },
        roomNumber: req.query.roomNumber,
      },
    },
    {
      $group: {
        _id: {
          $floor: {
            $divide: [
              { $subtract: ["$createdAt", new Date(0)] },
              req.query.minutes * 60 * 1000, // 25 minute in milliseconds
            ],
          },
        },
        averageHumidity: { $avg: "$humidity" },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $limit: 24,
    },
  ]);
  // console.log(data.length);
  res.status(200).json(data);
};

exports.soundReport = async (req, res) => {
  const data = await SensorData.aggregate([
    {
      $match: {
        soundSensor: { $exists: true },
        roomNumber: req.query.roomNumber,
      },
    },
    {
      $group: {
        _id: {
          $floor: {
            $divide: [
              { $subtract: ["$createdAt", new Date(0)] },
              req.query.minutes * 60 * 1000, // 25 minute in milliseconds
            ],
          },
        },
        averageSoundSensor: { $avg: "$soundSensor" },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $limit: 24,
    },
  ]);
  // console.log(data.length);
  res.status(200).json(data);
};

exports.lightReport = async (req, res) => {
  const data = await SensorData.aggregate([
    {
      $match: {
        lightIntensity: { $exists: true },
        roomNumber: req.query.roomNumber,
      },
    },
    {
      $group: {
        _id: {
          $floor: {
            $divide: [
              { $subtract: ["$createdAt", new Date(0)] },
              req.query.minutes * 60 * 1000, // 25 minute in milliseconds
            ],
          },
        },
        averageLightIntensity: { $avg: "$lightIntensity" },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $limit: 24,
    },
  ]);
  // console.log(data.length);
  res.status(200).json(data);
};

exports.temperaturePredictionReport = async (req, res, next) => {
  try {
    const prediction = (
      await axios.get("http://167.71.39.204:5000/next_hour_data")
    ).data;

    res.status(200).json({ prediction: prediction });
  } catch (err) {
    next(err);
  }
};
