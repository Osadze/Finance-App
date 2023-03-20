const express = require("express");
const router = express.Router();

const {
  getAllFinances,
  getFinance,
  createFinance,
  updateFinance,
  deleteFinance,
  createCategorie,
  getAllCategories,
} = require("../controllers/finances");

router.route("/").post(createFinance).get(getAllFinances);
router.route("/categories").post(createCategorie).get(getAllCategories);
router.route("/:id").get(getFinance).delete(deleteFinance).patch(updateFinance);

module.exports = router;
