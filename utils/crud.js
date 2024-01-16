const catchAsync = require("./catchAsync");
const GlobalError = require("./globalError");

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const deletedObject = await Model.findByIdAndDelete(req.params.id);
    if (!deletedObject) {
      console.log("I was here");
      return next(new GlobalError("Could not be found.", 404));
    }

    res.status(204).json({ operation: "delete", status: "success" });
  });
};

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const query = req.query || {};
    const objects = await Model.find(query);

    res.status(200).json({ operation: "Fetched All", data: objects });
  });
};

exports.getOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const object = await Model.findById({ _id: req.params.id });
    if (!object) {
      return next(new GlobalError("Could not be found.", 404));
    }

    res.status(200).json({ operation: "Fetched", data: object });
  });
};

exports.createOne = (Model, user) => {
  return catchAsync(async (req, res, next) => {
    if (req.file) {
      req.body.roomImage = req.file.path;
    }
    const newObject = await Model.create(req.body);

    res.status(201).json({ operation: "Created", data: newObject });
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    if (req.file) {
      req.body.roomImage = req.file.path;
    }
    const updatedObject = await Model.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedObject) {
      return next(new GlobalError("Could not be found.", 404));
    }

    res.status(200).json({ operation: "Updated", data: updatedObject });
  });
};
