module.exports = function(handler) {
  return async function(req, res, next) {
    try {
      await handler(res, req);
    } catch (error) {
      next();
    }
  };
};
