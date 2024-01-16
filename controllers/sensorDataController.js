const SensorData = require("../models/sensorData");
const crud = require("../utils/crud");

exports.createSensorData = crud.createOne(SensorData);
exports.getSensorData = crud.getOne(SensorData);
exports.updateSensorData = crud.updateOne(SensorData);
exports.deleteSensorData = crud.deleteOne(SensorData);
// exports.getAllSensorDatas = crud.getAll(SensorData);
