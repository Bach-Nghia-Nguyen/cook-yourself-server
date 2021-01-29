const Jimp = require("jimp");
// const fs = require("fs");

const photoHelper = {};

photoHelper.resize = async (req, res, next) => {
  if (req.file) {
    try {
      req.file.destination = "public" + req.file.destination.split("public")[1];
      req.file.path = "public" + req.file.path.split("public")[1];
      const image = await Jimp.read(req.file.path);
      await image.scaleToFit(400, 400).write(req.file.path);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next(new Error("Image required"));
  }
};

module.exports = photoHelper;
