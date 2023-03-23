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

// const updateCategory = async (req, res) => {
//   const {
//     user: { userId },
//     params: { name: categoryName },
//   } = req;

//   if (categoryName === "") {
//     throw new BadRequestError("Fields cannot be empty");
//   }

//   const category = await Categories.findOneAndUpdate(
//     { categoryName: categoryName, createdBy: userId },
//     req.body,
//     { new: true, runValidators: true }
//   );

//   if (!category) {
//     throw new NotFoundError(`No Category with this ${categoryName}`);
//   }

//   res.status(StatusCodes.OK).json({ category });
// };

const updateCategory = async (req, res) => {
  const {
    user: { userId },
    params: { name: categoryName },
  } = req;

  if (categoryName === "") {
    throw new BadRequestError("Fields cannot be empty");
  }

  // find the category and update it
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

  // validate the updated category
  const validationError = category.validateSync();
  if (validationError) {
    throw new BadRequestError(validationError.message);
  }

  // save the updated category
  category = await category.save();

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
  const {
    search,
    sort,
    money,
    moneyMin,
    moneyMax,
    type,
    status,
    // category, for future
    startDate,
    endDate,
  } = req.query;

  // const formattedStartDate = startDate.toISOString().slice(0, 10);

  console.log(startDate, endDate);

  const query = {};

  if (search) {
    const regex = new RegExp(search, "i"); // "i" for case-insensitive
    query.financeName = { $regex: regex };
  }

  if (type) {
    query.type = type;
  }

  if (status) {
    query.status = status;
  }

  if (money) {
    query.money = { $lte: money };
  }

  // For Money and Date Range Filter

  if (moneyMin && moneyMax) {
    query.money = { $gte: Number(moneyMin), $lte: Number(moneyMax) };
  } else if (moneyMin) {
    query.money = { $gte: Number(moneyMin) };
  } else if (moneyMax) {
    query.money = { $lte: Number(moneyMax) };
  }

  // error when choosing more than created at, min and max

  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (startDate) {
    query.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    query.createdAt = { $lte: new Date(endDate) };
  }

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

// Search

const getSearch = async (req, res) => {
  // let data = await Finance.find({
  //   createdBy: req.user.userId,
  //   // Only searches with financeNames and categories ones that are used in finances.
  //   $or: [
  //     { financeName: { $regex: (req.params.key, "i") } }, // "i" - For Search case-insensitivity
  //     { category: { $regex: (req.params.key, "i") } },
  //   ],
  // });
  // res.json(data);
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
  getSearch,
};
