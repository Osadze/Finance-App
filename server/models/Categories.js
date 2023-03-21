const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      maxLenght: 50,
      default: "Default",
      required: [true, "Please provide Category name"],
      validate: {
        // Define a custom validator function for the categoryName field
        validator: async function (name) {
          // Use the findOne method of the Categories model to check for existing categories with the same name and createdBy
          const existingCategory = await this.constructor.findOne({
            categoryName: name,
            createdBy: this.createdBy,
          });
          return !existingCategory; // Return true if no matching category is found
        },
        message: "Category name must be unique for each user",
      },
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
