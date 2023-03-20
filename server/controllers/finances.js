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

const createCategorie = async (req, res) => {
  // Unique category names for single person
  req.body.createdBy = req.user.userId;
  const category = await Categories.create(req.body);
  res.status(StatusCodes.CREATED).json({ category });
};

// delete, update

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
    body: { financeName, description, type, status, money, categorie },
    user: { userId },
    params: { id: financeId },
  } = req;

  if (description === "" || type === "") {
    throw new BadRequestError("Fields cannot be empty");
  }

  //mosafiqrebelia tu name aris carieli rogor mieces default avtomaturad
  const finance = await Finance.findByIdAndUpdate(
    { _id: financeId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!finance) {
    throw new NotFoundError(`No Finance with this ${financeId}`);
  }
  res.status(StatusCodes.OK).json({ finance });
};

const deleteFinance = async (req, res) => {
  const {
    body: { financeName, description, type, status, money, categorie },
    user: { userId },
    params: { id: financeId },
  } = req;

  const finance = await Finance.findByIdAndDelete({
    _id: financeId,
    createdBy: userId,
  });

  if (!finance) {
    throw new NotFoundError(`No Finance with this ${financeId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllCategories,
  createCategorie,
  getAllFinances,
  getFinance,
  createFinance,
  updateFinance,
  deleteFinance,
};
