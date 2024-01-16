const About = require("../models/about");
const crud = require("../utils/crud");

exports.createAbout = crud.createOne(About);
exports.getAbout = async (req, res, next) => {
  try {
    const about = await About.findOne();
    res.status(200).json(about);
  } catch (err) {
    next(err);
  }
};
exports.updateAbout = async (req, res, next) => {
  try {
    const about = await About.findOne();
    const updatedAbout = await About.findByIdAndUpdate(about._id, req.body);
    res.status(200).json(updatedAbout);
  } catch (err) {
    next(err);
  }
};
