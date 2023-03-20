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
    params: { name: categoryName },
  } = req;

  console.log(categoryName,'aaaaaaaaaaaaaaaaaaaaaa')
  const category = await Categories.findOneAndDelete({
    categoryName: categoryName,
    createdBy: userId,
  });

  if (!category) {
    throw new NotFoundError(`No Category with this id ${categoryName}`);
  }

  // Get all finances that have the deleted category ID
  const finances = await Finance.find({ category: categoryName });

  // Update each finance record
  for (const finance of finances) {
    const categoryIds = finance.category;

    // Check if the array only contains the deleted category ID
    if (categoryIds.length === 1 && categoryIds[0] === categoryName) {
      finance.category = ["Default"];
    } else {
      // Remove the deleted category ID from the array
      const index = categoryIds.indexOf(categoryName);
      if (index !== -1) {
        categoryIds.splice(index, 1);
      }
      finance.category = categoryIds;
    }

    await finance.save();
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
    body: { financeName, description, type, money },
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
  res.status(StatusCodes.OK).json({ finance });
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
