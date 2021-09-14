const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    surName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: String,
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },

  {
    collection: "User",
    timestamps: true, // inserts createdAt and updatedAt
  }
);

userSchema.methods.getAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.name,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("User", userSchema);
function validateUser(user) {
  schema = {
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  };
  return Joi.validate(user, schema);
}
function ValidateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.ValidateObjectId = ValidateObjectId;
