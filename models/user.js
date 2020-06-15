const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: String,
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExp: Date,
  basket: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        pharmacyId: {
          type: Schema.Types.ObjectId,
          ref: "Pharmacy", //зв'язок між таблицями
          required: true,
        },
      },
    ],
  },
});


userSchema.methods.addToCart = function (pharmacy) {
  const items = [...this.basket.items];

  const idx = items.findIndex((c) => {
    return c.pharmacyId.toString() === pharmacy._id.toString();
  });
  if (idx >= 0) {
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      pharmacyId: pharmacy._id,
      count: 1,
    });
  }

  // const newCart = {items: clonedItems};
  // this.cart = newCart;

  this.basket = { items };
  // console.log(this);
  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.basket.items];
  const idx = items.findIndex((c) => {
    return c.pharmacyId.toString() === id.toString();
  });

  if (items[idx].count === 1) {
    console.log('123')
    items = items.filter((c) => c.pharmacyId.toString() !== id.toString());
  } else {
    items[idx].count--;
  }

  this.basket = { items };
  // console.log(this);
  return this.save();
};

userSchema.methods.clearCart = function(){
  this.basket = {items: []}
  return this.save();
}

module.exports = model("User", userSchema);