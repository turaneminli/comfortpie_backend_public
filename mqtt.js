const mqtt = require("mqtt");
const SensorData = require("./models/sensorData");
const { emitAlarm } = require("./socket");
const config = require("config");

exports.connectMQTT = () => {
  const client = mqtt.connect("mqtt://167.71.39.204:1883", {
    username: config.get("mqttUsername"),
    password: config.get("mqttPassword"),
  });

  client.on("connect", () => {
    console.log("Connected to the broker...");
    client.subscribe("AIPL/#");
  });

  client.on("error", (err) => console.log(err));

  client.on("message", async (topic, message) => {
    console.log(topic, message.toString());

    if (topic.split("/")[2] === "carbonmonoxide" && +message.toString() === 1) {
      emitAlarm(
        "Carbonmonoxide",
        topic.split("/")[1].replace("ComfortPie_", "")
      );
    }

    if (topic.split("/")[2] === "flameSensor" && +message.toString() === 1) {
      console.log("here flame is on");
      emitAlarm("Fire", topic.split("/")[1].replace("ComfortPie_", ""));
    }

    await SensorData.create({
      [`${topic.split("/")[2]}`]: +message.toString(),
      roomNumber: topic.split("/")[1].replace("ComfortPie_", ""),
    });
  });

  client.on("close", () => {
    console.log("MQTT broker is closed...");
  });
};
