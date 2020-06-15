const { Router } = require("express");
const Pharmacy = require('../models/pharmacy')
const Order = require("../models/order");
const { findByIdAndDelete } = require("../models/pharmacy");
const authAdmin = require('..//')
const router = Router();

// router.get("/filters", async (req, res) => {
//   try{
//   const pharmacy = await Pharmacy.find();
    
//   res.status(200).json(pharmacy);
//     // res.render('index');
//   }
//   catch(e){
//     console.log(e);
//   }
//   // res.redirect('/');
// });

router.get("/", async (req, res) => {
  const pharmacy = await Pharmacy.find({maker: 'Sanofi'});
    // console.log('homeContent');
  res.render("index", {
    title: "Головна сторінка",
    isHome: true,
    pharmacy,
  });
});

router.get("/delivery", (req, res) => {
  res.render("delivery", {
    title: "Доставка",
  });
});

router.get("/connect", (req, res) => {
  res.render("connect", {
    title: "Контакти",
  });
});

router.get("/maker", (req, res) => {
  res.render("maker", {
    title: "Контакти",
  });
});

router.get('/about', (req,res) => {
  res.render("about", {
    title: "Про компанію",
  });
})

router.get('/orders-admin', async (req, res) => {
  try{
    const orders = await Order.find().sort({date: -1});
    res.render('orders-admin', {
      title: "Замовлення",
      orders: orders.map(c => {
          return {
              ...c._doc,
              price: c.pharmacy.reduce((total, a) => {
                  return total += a.count* a.pharma.price
              }, 0)
          }
      })
    })
  }
  catch(e){
    console.log(e);
  }
})

router.post('/done', async (req, res) =>{
  // console.log(req.body.id_delete);
  const orders = await Order.findByIdAndDelete(req.body.id_delete);
  res.redirect('/orders-admin')
})

// router.get('/homeContent', async (req, res) => {
//   try{
//     pharmacy = await Pharmacy.find();
//     console.log('homeContent');
//     res.redirect('/')
//   }
//   catch(e){
//     console.log(e);
//   }
  
// })

module.exports = router;
