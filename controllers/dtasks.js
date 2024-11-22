const Task = require("../models/Task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");
const getAlldynamicIn = async (req, res) => {
  const {
    completed,
    name,
    TransactionDescription,
    DebitCredit,
    TransactionDate,
    Amt,
    sort,
    fields,
    numericFilters,
  } = req.query;
  const queryObject = {};

  if (completed) {
    queryObject.completed = completed === "true" ? true : false;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (TransactionDescription) {
    queryObject.DebitCredit = { $regex: TransactionDescription, $options: "i" };
  }
  if (DebitCredit) {
    queryObject.DebitCredit = { $regex: DebitCredit, $options: "i" };
  }
  if (numericFilters) {
    const opeartorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$e",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${opeartorMap[match]}-`
    );
    const options = ["Amt"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  let result = Task.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-TransactionDate");
  }
  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10000;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const tasks = await result;
  const taskCount = await Task.countDocuments();
  res.status(200).json({ tasks, taskCount: tasks.length });
};

const getAlldynamic = asyncWrapper(getAlldynamicIn);

module.exports = {
  getAlldynamic,
};
