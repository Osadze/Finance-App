const Finance = require("../models/Finance");
const Categories = require("../models/Categories");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllCategories = async (req, res) => {
  const categories = await Categories.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ categories, count: categories.length });
};

const createCategory = async (req, res) => {
  // Unique category names for single person
  req.body.createdBy = req.user.userId;
  const category = await Categories.create(req.body);
  res.status(StatusCodes.CREATED).json({ category });
};

// delete, update

const updateCategory = async (req, res) => {
  const {
    body: { categoryName },
    user: { userId },
    params: { id: categoryId },
  } = req;

  if (categoryName === "") {
    throw new BadRequestError("Fields cannot be empty");
  }

  const category = await Categories.findByIdAndUpdate(
    { _id: categoryId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!category) {
    throw new NotFoundError(`No Category with this ${categoryId}`);
  }
  res.status(StatusCodes.OK).json({ category });
};

const deleteCategory = async (req, res) => {
  const {
    user: { userId },
    params: { id: categoryId },
  } = req;

  const category = await Categories.findByIdAndDelete({
    _id: categoryId,
    createdBy: userId,
  });

  if (!category) {
    throw new NotFoundError(`No Category with this id ${categoryId}`);
  }
  res.status(StatusCodes.OK).send("Category Has Been Deleted!");
};


const getAllFinances = async (req, res) => {
  const finances = await Finance.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ finances, count: finances.length });
};

const getFinance = async (req, res) => {
  const {
    user: { userId },
    params: { id: financeId },
  } = req;

  const finance = await Finance.findOne({
    _id: financeId,
    createdBy: userId,
  });
  if (!finance) {
    throw new NotFoundError(`No Finance with this ${financeId}`);
  }
  res.status(StatusCodes.OK).json({ finance });
};

const createFinance = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const finance = await Finance.create(req.body);
  res.status(StatusCodes.CREATED).json({ finance });
};
const updateFinance = async (req, res) => {
  const {
    body: { financeName, description, type, money,},
    user: { userId },
    params: { id: financeId },
  } = req;

  if (financeName === "" || description === "" || type === "" || money == "") {
    throw new BadRequestError("Fields cannot be empty");
  }

  const finance = await Finance.findByIdAndUpdate(
    { _id: financeId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!finance) {
    throw new NotFoundError(`No Finance with this id ${financeId}`);
  }
  res.status(StatusCodes.OK).send("Finance Has Been Updated!").json({ finance });
};

const deleteFinance = async (req, res) => {
  const {
    user: { userId },
    params: { id: financeId },
  } = req;

  const finance = await Finance.findByIdAndDelete({
    _id: financeId,
    createdBy: userId,
  });

  if (!finance) {
    throw new NotFoundError(`No Finance with this id ${financeId}`);
  }
  res.status(StatusCodes.OK).send("Finance Has Been Deleted!");
};

module.exports = {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getAllFinances,
  getFinance,
  createFinance,
  updateFinance,
  deleteFinance,
};
