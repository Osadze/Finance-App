const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      maxLenght: 50,
      default: "Default",
      required: [true, "Please provide Category name"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", CategoriesSchema);
