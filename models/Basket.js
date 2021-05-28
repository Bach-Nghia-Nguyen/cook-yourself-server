const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ref (reference): Product
const itemSchema = Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1."],
    },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const basketSchema = Schema(
  {
    items: [itemSchema],
    subTotal: { default: 0, type: Number },
  },
  { timestamps: true }
);

const Basket = mongoose.model("Basket", basketSchema);
module.exports = Basket;
