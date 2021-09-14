module.exports = function(err, res, res, next) {
  console.log("error:", err.message);
  res.status(500).send(`Server Internal Error:${err.message}`);
};
