const router = require("express").Router();
const sensorDataController = require("../controllers/sensorDataController");
const roomController = require("../controllers/roomController");
const authController = require("../controllers/authController");
const aboutController = require("../controllers/aboutController");

const auth = require("../middleware/auth");
const sensorDataReports = require("../controllers/sensorDataReports");

router.get("/sensor-data", auth, sensorDataController.getSensorData);
router.post("/sensor-data", auth, sensorDataController.createSensorData);

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);

router.get("/room-info", roomController.getAllRoomInfos);
router.post("/room-info", auth, roomController.createRoomInfo);
router.put("/room-info/:id", auth, roomController.updateRoomInfo);
router.delete("/room-info/:id", auth, roomController.deleteRoomInfo);
router.get("/room-info/:id", roomController.getRoomInfo);

// reports
router.get("/temperature-report", sensorDataReports.temperatureReport);
router.get("/humidity-report", sensorDataReports.humidityReport);
router.get("/light-report", sensorDataReports.lightReport);
router.get("/sound-report", sensorDataReports.soundReport);
router.get(
  "/temperature-prediction-report",
  sensorDataReports.temperaturePredictionReport
);

router.get("/users", auth, authController.getAllUsers);
router.get("/users/:id", auth, authController.getUser);
router.put("/users/:id", authController.updateUser);

router.get("/about", aboutController.getAbout);
router.post("/about", auth, aboutController.createAbout);
router.put("/about", auth, aboutController.updateAbout);

module.exports = router;
