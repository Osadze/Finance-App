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
  req.body.createdBy = req.user.userId;
  const category = await Categories.create(req.body);
  res.status(StatusCodes.CREATED).json({ category });
};

// Update Delete

const updateCategory = async (req, res) => {
  const {
    user: { userId },
    params: { name: categoryName },
  } = req;

  if (categoryName === "") {
    throw new BadRequestError("Fields cannot be empty");
  }

  // Find the category and update it
  let category = await Categories.findOne({
    categoryName: categoryName,
    createdBy: userId,
  });

  if (!category) {
    throw new NotFoundError(
      `No Category with Name: ${categoryName} For User '${userId}`
    );
  }

  // update the category fields
  category.categoryName = req.body.categoryName || category.categoryName;

  // Validate the updated category
  const validationError = category.validateSync();
  if (validationError) {
    throw new BadRequestError(validationError.message);
  }

  // Save the updated category
  category = await category.save();

  const finances = await Finance.find({ category: categoryName });

  for (const finance of finances) {
    const updatedCategory = req.body.categoryName;
    console.log(categoryName, ",", updatedCategory);

    if (updatedCategory !== categoryName) {
      // Remove the old category from the finance's category list
      const index = finance.category.indexOf(categoryName);
      if (index > -1) {
        finance.category.splice(index, 1);
      }

      // Add the updated category to the finance's category list
      finance.category.push(updatedCategory);
    }

    // Save the updated finance
    await finance.save();
  }
  res.status(StatusCodes.OK).json({ category });
};

const deleteCategory = async (req, res) => {
  const {
    user: { userId },
    params: { name: categoryName },
  } = req;

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

    // Check if the array only contains the deleted category ID and Set "Default" as a category name
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
    // Save the updated finance
    await finance.save();
  }
  res.status(StatusCodes.OK).send("Category Has Been Deleted!");
};

const getAllFinances = async (req, res) => {
  const {
    search,
    sort,
    money,
    moneyMin,
    moneyMax,
    type,
    status,
    startDate,
    endDate,
  } = req.query;

  const query = {};

  // Search by financeName

  if (search) {
    const regex = new RegExp(search, "i"); // "i" for case-insensitive
    query.financeName = { $regex: regex };
  }

  // Filter by type and status

  if (type) {
    query.type = type;
  }

  if (status) {
    query.status = status;
  }

  if (money) {
    query.money = { $lte: money }; // For sorting by money
  }

  // For Money and Date Range Filter

  if (moneyMin && moneyMax) {
    query.money = { $gte: Number(moneyMin), $lte: Number(moneyMax) };
  } else if (moneyMin) {
    query.money = { $gte: Number(moneyMin) };
  } else if (moneyMax) {
    query.money = { $lte: Number(moneyMax) };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start.getTime() === end.getTime()) {
      // If the start and end dates are equal, add one day to the end date
      end.setDate(end.getDate() + 1);
    }
    query.createdAt = { $gte: start, $lte: end };
  } else if (startDate) {
    query.createdAt = { $gte: new Date(startDate) };
  } else if (endDate) {
    query.createdAt = { $lte: new Date(endDate) };
  }

  // Sort by money, name and create time

  const sortObj =
    sort === "money_asc"
      ? { money: 1 }
      : sort === "money_desc"
      ? { money: -1 }
      : sort === "financeName_asc"
      ? { financeName: 1 }
      : sort === "financeName_desc"
      ? { financeName: -1 }
      : sort === "createdAt_asc"
      ? { createdAt: 1 }
      : { createdAt: -1 };

  try {
    const finances = await Finance.find({
      createdBy: req.user.userId,
      ...query,
    })
      .sort(sortObj)
      .lean();

    res.status(StatusCodes.OK).json({ finances, count: finances.length });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json("An error occurred while fetching the finances.");
  }
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
