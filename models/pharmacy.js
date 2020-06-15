const { Schema, model } = require("mongoose");

const pharmacySchema = new Schema({
  title: {
    type: String,
    required: true, //Вказуємо, що поле обов'язкове
  },
  maker: {
    type: String,
    required:true
  },
  quantity: {
    type: Number,
    required:true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type:String,
    required:true,
  },
  description: {
    type:String,
    required:true,
  },
  img: String,
  img1: String,
  img2: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

pharmacySchema.method('toClient', function(){
  const pharma = this.toObject();

  pharma.id = pharma._id;
  delete pharma._id;

  return pharma
})

module.exports = model("Pharmacy", pharmacySchema);
