const config = require("config");
const fs = require("fs");

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
const deleteImage = (path) => {
  const filePath = path;
  fs.unlinkSync(filePath);
};
const getLastTwoMonthRecipeFilter = () => {
  return {
    $match: {
      $expr: {
        $and: [
          { $eq: [{ $year: "$createdAt" }, { $year: new Date() }] },
          {
            $or: [
              {
                $eq: [
                  0,
                  {
                    $subtract: [
                      { $month: new Date() },
                      { $month: "$createdAt" },
                    ],
                  },
                ],
              },
              {
                $eq: [
                  1,
                  {
                    $subtract: [
                      { $month: new Date() },
                      { $month: "$createdAt" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  };
};
const getLastMonthRecipeFilter = () => {
  return {
    $match: {
      $expr: {
        $and: [
          { $eq: [{ $year: "$createdAt" }, { $year: new Date() }] },
          {
            $or: [
              {
                $eq: [
                  0,
                  {
                    $subtract: [
                      { $month: new Date() },
                      { $month: "$createdAt" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  };
};
module.exports = {
  createImageUrl,
  getImagePath,
  isImage,
  getLastTwoMonthRecipeFilter,
  getLastMonthRecipeFilter,
  deleteImage,
};
