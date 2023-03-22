const express = require("express");
const router = express.Router();

const {
  getAllFinances,
  getFinance,
  createFinance,
  updateFinance,
  deleteFinance,
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getSearch,
} = require("../controllers/finances");

router.route("/").post(createFinance).get(getAllFinances);
router.route("/categories").post(createCategory).get(getAllCategories);
router.route("/categories/:name").delete(deleteCategory).patch(updateCategory);
router.route("/:id").get(getFinance).delete(deleteFinance).patch(updateFinance);
router.route("/search/:key").get(getSearch);

module.exports = router;
