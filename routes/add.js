const { Router } = require("express");
const Pharmacy = require("../models/pharmacy");
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/auth-admin');
const {validationResult} = require('express-validator');
const {pharmaValidators} = require('../utils/validators');
const router = Router();

router.get("/", auth, authAdmin, (req, res) => {
  res.render("add", {
    title: "Додати засіб",
    isAdd: true,

  });
});

router.post("/", auth,  authAdmin,pharmaValidators, async (req, res) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    return res.status(422).render('add',
    {
      title: "Додати засіб",
    isAdd: true,
    error: errors.array()[0].msg,
    data: {
      title: req.body.title,
    price: req.body.price,
    quantity: req.body.quantity,
    type: req.body.type,
    maker: req.body.maker,
    img: req.body.img,
    img1: req.body.img1,
    img2: req.body.img2,
    description: req.body.description,
    }
    })
  }

  const pharmacy = new Pharmacy({
    title: req.body.title,
    price: req.body.price,
    quantity: req.body.quantity,
    type: req.body.type,
    maker: req.body.maker,
    img: req.body.img,
    img1: req.body.img1,
    img2: req.body.img2,
    description: req.body.description,
    userId: req.user,
  });

  try{
      await pharmacy.save();
  res.redirect("/catalog");
  }
  catch(e) {
    console.log(e);
  }

  
});

module.exports = router;
