const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "optional"],
    trim: true,
    maxlength: [200, "desc can not be more than 200 characters"],
  },
  TransactionDescription: {
    type: String,
    required: [true, "optional"],
    trim: true,
    maxlength: [
      2000,
      " Transaction Description can not be more than 2000 characters",
    ],
  },
  DebitCredit: {
    type: String,
    required: [true, "optional"],
    trim: true,
    maxlength: [200, "transtype can not be more than 200 characters"],
  },
  Amt: { type: Number },
  TransactionDate: {
    type: Date,
    required: [true, "must provide date"],
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
