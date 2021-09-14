const config = require("config");

const isImage = (type) => {
  const mimeTypes = ["image/gif", "image/jpeg", "image/png"];
  return mimeTypes.includes(type);
};
const createImageUrl = (destination, filename) => {
  return (
    // config.host +
    // ":" +
    config.assetsBaseUrl + "/images" + destination.substring(16) + filename
  );
};

const getImagePath = (image) => {
  return "./public/uploads" + image.substring(image.indexOf("images") + 6);
};
module.exports = { createImageUrl, getImagePath, isImage };
