const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("config");
const multer = require("multer");
const path = require("path");

const mainRouter = require("./routers/mainRouter");

const app = express();

app.use(bodyParser.json({ limit: "2mb" }));

// CORS
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// swagger ui
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const { connectMQTT } = require("./mqtt");
const { connectSocket } = require("./socket");

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// image upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // replace : with - because Windows does not support ":"
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

connectMQTT();
connectSocket(app);

// Application Routes
app.use(mainRouter);

// ERROR Middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(config.get("mongoDbConnectionString"))
  .then(() => {
    app.listen(8081);
    console.log("Listening to port 8081...");
  })
  .catch((err) => console.log(err));
