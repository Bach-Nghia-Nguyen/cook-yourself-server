const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ref (reference): Product
const itemSchema = Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    user: {},
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
// Mua 1 goi ca, 2 goi tom:
// Basket: 1 ca * gia ca + 2 tom * gia tom
//{productId:dkfjdkfjd, user:djfslkfaj, quantity:1, price: 50000, total: 50000}
{
  products: [
    {
      productId1,
      quantity,
      price,
    },
    {
      productId2,
      quantity,
      price,
    },
  ],
    userId,
    total;
}
basket: prodcuts: [{ prodcut: djsfkfhjdsf }];

const basketSchema = Schema(
  {
    items: [itemSchema],
    subTotal: { default: 0, type: Number },
  },
  { timestamps: true }
);

const Basket = mongoose.model("Basket", basketSchema);
module.exports = Basket;
