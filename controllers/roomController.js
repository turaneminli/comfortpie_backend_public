const RoomInfo = require("../models/room");
const sensorData = require("../models/sensorData");
const SensorData = require("../models/sensorData");
const crud = require("../utils/crud");

exports.createRoomInfo = crud.createOne(RoomInfo);
exports.getRoomInfo = async (req, res, next) => {
  try {
    const roomInfo = await RoomInfo.findById(req.params.id);
    const sensorData = await SensorData.find({
      roomNumber: "Room" + roomInfo.roomNumber,
    })
      .limit(15)
      .sort({ createdAt: -1 })
      .lean();

    const sensorLabels = [
      "temperature",
      "humidity",
      "flameSensor",
      "soundSensor",
      "lightIntensity",
      "carbonmonoxide",
    ];

    const sensorDataReduced = sensorData.reduce((acc, sensorInfo) => {
      sensorLabels.forEach((sensorLabel) => {
        if (sensorInfo.hasOwnProperty(sensorLabel)) {
          if (!acc[sensorLabel]) {
            acc[sensorLabel] = sensorInfo[sensorLabel];
          }
        }
      });
      return acc;
    }, {});

    res.status(200).json({ roomInfo, sensorData: sensorDataReduced });
  } catch (error) {
    next(error);
  }
};
exports.updateRoomInfo = crud.updateOne(RoomInfo);
exports.deleteRoomInfo = crud.deleteOne(RoomInfo);

exports.getAllRoomInfos = async (req, res, next) => {
  try {
    // http://www.comportpi.com/api/rooms?temperature=25,27&humidity=40,45&light=22,25&sound=34,38
    const searchQuery = {};
    if (req.query.roomNumber) {
      searchQuery.roomNumber = { $regex: req.query.roomNumber };
    }
    const sensorLabels = [
      "temperature",
      "humidity",
      "soundSensor",
      "lightIntensity",
    ];

    const rooms = await RoomInfo.find(searchQuery).lean();
    const sensorDatas = await SensorData.find({
      $or: [
        { temperature: { $exists: true } },
        { humidity: { $exists: true } },
        { soundSensor: { $exists: true } },
        { lightIntensity: { $exists: true } },
      ],
    })
      .limit(50)
      .sort({ createdAt: -1 })
      .lean();

    sensorDatas.forEach((sensorData) => {
      const roomNumber = sensorData.roomNumber.replace("Room", "");
      const roomIndex = rooms.findIndex(
        (room) => room.roomNumber === roomNumber
      );
      if (roomIndex === -1) {
        return;
      }
      const sensorField = Object.keys(sensorData).filter((field) =>
        sensorLabels.includes(field)
      )[0];

      if (!rooms?.[roomIndex]?.[sensorField]) {
        rooms[roomIndex][sensorField] = sensorData[sensorField];
      }
    });

    const filteredRooms = rooms.filter((room) => {
      const isWithinRange = (value, range) => {
        if (!range) {
          return true;
        }

        const [min, max] = range.split(",");

        return (
          (min === undefined || value >= parseFloat(min)) &&
          (max === undefined || value <= parseFloat(max))
        );
      };

      // Check each parameter individually
      const temperatureCheck = isWithinRange(
        room.temperature,
        req.query.temperature
      );
      const humidityCheck = isWithinRange(room.humidity, req.query.humidity);
      const soundSensorCheck = isWithinRange(
        room.soundSensor,
        req.query.soundSensor
      );
      const lightIntensityCheck = isWithinRange(
        room.lightIntensity,
        req.query.lightIntensity
      );

      if (
        temperatureCheck &&
        humidityCheck &&
        soundSensorCheck &&
        lightIntensityCheck
      ) {
        return room;
      }
    });
    res.status(200).json(filteredRooms);
  } catch (error) {
    next(error);
  }
};
