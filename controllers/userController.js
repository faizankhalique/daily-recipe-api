const bcrypt = require("bcryptjs");

const { User, validateUser } = require("../models/user");
const { validateObjectId } = require("../helpers/validateObjectId");

exports.getUser = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).send("Invalid user _id");
  let user = await User.findById(req.params.id).select({
    password: 0,
    createdAt: 0,
    updatedAt: 0,
    __V: 0,
  });

  if (!user) return res.status(400).send("User not Exist");
  res.status(200).send(user);
};
exports.updateUser = async (req, res) => {
  const { _id, name, surName, address } = req.body;
  if (!validateObjectId(_id)) return res.status(400).send("Invalid user _id");

  let user = await User.findById(_id);

  user.name = name ? name : user.name;
  user.surName = surName ? surName : user.surName;
  user.address = address ? address : user.address;
  const result = await user.save();
  res.status(200).send(result);
};
exports.changePassword = async (req, res) => {
  const body = req.body;
  if (!validateObjectId(req.user._id))
    return res.status(400).send("Invalid user _id");
  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("User not Exist");
  const hashPassword = await bcrypt.hash(body.password, 10);
  user.password = hashPassword;
  await user.save();
  res.status(200).send("Password Changed Successfully!");
};
