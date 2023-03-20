const mongoose = require("mongoose");

const FinanceSchema = new mongoose.Schema(
  {
    financeName: {
      type: String,
      required: [true, "Please provide a name"],
      maxLenght: 50,
    },
    description: {
      type: String,
      maxLenght: 300,
    },
    money: {
      type: Number,
      required: [true, "Please provide a type"],
      maxLenght: 50,
    },
    type: {
      type: String,
      required: [true, "Please provide a type"],
      enum: ["income", "outcome"],
    },
    status: {
      type: String,
      required: [
        function () {
          return this.type === "outcome";
        },
        "please provide a status",
      ],
      enum: ["processing", "completed"],
    },
    category: {
      type: Array,
      // need enum to have categoryNames
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Finance", FinanceSchema);
