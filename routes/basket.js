const { Router } = require("express");
const Pharmacy = require("../models/pharmacy");
const auth = require('../middleware/auth');
const router = Router();

function mapCartItems(basket){
  return basket.items.map(c => ({
    ...c.pharmacyId._doc,
    id: c.pharmacyId.id,
    count: c.count
  }))
}

function computePrice(pharmacy) {
  return pharmacy.reduce((total, pharmacy1) => {
      return total += pharmacy1.price * pharmacy1.count;
  }, 0)
}

router.get("/", auth, async (req, res) => {
  const user = await req.user
  .populate('basket.items.pharmacyId')
  .execPopulate();

  // console.log(user.basket.items[0].count);
  const pharmacy = mapCartItems(user.basket)

  res.render("basket", {
    title: "Кошик",
    pharmacy: pharmacy,
    price: computePrice(pharmacy),
  });
});

router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('basket.items.pharmacyId')
    .execPopulate();
    const pharmacy = mapCartItems(user.basket)
    const basket = {
      pharmacy, price: computePrice(pharmacy)
    }
  res.status(200).json(basket);
});

router.post("/add", auth, async (req, res) => {
  const pharmacy = await Pharmacy.findById(req.body.id);
  // console.log('12345')
  await req.user.addToCart(pharmacy);
  res.redirect("/basket");
});

module.exports = router;
