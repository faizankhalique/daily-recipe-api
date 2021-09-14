const mongoose = require('mongoose')
exports.validateObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}