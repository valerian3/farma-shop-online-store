const { Router } = require("express");
const Order = require("../models/order");
const auth = require('../middleware/auth');
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({
        'user.userId': req.user._id
    }).populate('user.userId')


    res.render("orders", {
      title: "Оформлення",
      orders: orders.map(c => {
          return {
              ...c._doc,
              price: c.pharmacy.reduce((total, a) => {
                  return total += a.count* a.pharma.price
              }, 0)
          }
      })
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user
      .populate("basket.items.pharmacyId")
      .execPopulate();

    const pharmacy_goods = user.basket.items.map((c) => ({
      count: c.count,
      pharma: { ...c.pharmacyId },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      pharmacy: pharmacy_goods,
    });

    await order.save();
    await req.user.clearCart();
  } catch (e) {
    console.log(e);
  }

  res.redirect("/orders");
});



module.exports = router;
