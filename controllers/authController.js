const Joi = require("joi");
const bcrypt = require("bcryptjs");

const { User, validateUser } = require("../models/user");

exports.login = async (req, res) => {
  const body = req.body;
  const { error } = validateLogin(body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(400).send("Email Not Exist");
  const validPassword = bcrypt.compareSync(body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");
  const token = user.getAuthToken();
  res.status(200).send({
    _id: user._id,
    token: token,
    name: user.name,
    email: user.email,
  });
};
exports.createUser = async (req, res, next) => {
  const body = req.body;
  const { error } = validateUser(body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: body.email });
  if (user) return res.status(400).send("User Email Already Exist");
  const hashPassword = await bcrypt.hash(body.password, 10);
  user = new User(body);
  user.password = hashPassword;
  const result = await user.save();
  const token = user.getAuthToken();
  res.status(200).send({
    _id: result._id,
    name: user.name,
    email: user.email,
    token,
  });
};
function validateLogin(user) {
  schema = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  };
  return Joi.validate(user, schema);
}
