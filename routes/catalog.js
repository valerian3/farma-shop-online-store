const { Router } = require("express");
const Pharmacy = require("../models/pharmacy");
const auth = require("../middleware/auth");
const {validationResult} = require('express-validator');
const authAdmin = require('../middleware/auth-admin');
const { resolveContent } = require("nodemailer/lib/shared");
const {pharmaValidators} = require('../utils/validators');
const router = Router();
let s = '';
let a = '';
function isOwner(pharmacy, req) {
  return pharmacy.userId.toString() === req.user._id.toString();
}

// function myFunction(elem){
//   console.log(elem);
// }

router.get("/", async (req, res) => {
  try {
    let pharmacy;
    // console.log(s);
    
    if(s === '' && a === ''){
      pharmacy = await Pharmacy.find().populate("userId");
    }
    else if(s !== ''){
      pharmacy = await Pharmacy.find({maker: s}).populate("userId");
    }else if(a !== ''){
      pharmacy = await Pharmacy.find().populate("userId")
      let use1 = [];
      // let name = c.title.toLowerCase().toString();
      pharmacy.filter((c, index) => {
        if(c.title.toLowerCase().toString().indexOf(a.toLowerCase().toString()) >= 0){
          use1.push(c);
        }
      })
        
        // console.log(name); 
        // console.log(name.indexOf(a.toLowerCase().toString()))
        // if(name.indexOf(a.toLowerCase().toString()) >= 0){
          // console.log(c.title + ' true');
          // console.log('true');
        // }
        // else{
          // console.log('else');console.log(...c);
          // console.log(c);
          // console.log(index);
          // c.splice(index, 1);
          // delete c;
          // console.log(pharmacy.c);
        //}
      
      pharmacy = use1;
      // console.log(pharmacy.length)
    }

    // console.log(pharmacy);
    // if(s === ''){
    //   pharmacy = await Pharmacy.find().populate("userId");
    // }else{
    //   pharmacy = await Pharmacy.find({maker: s}).populate("userId");
    // }
    s = '';
    a = '';
    
    res.render("catalog", {
      title: "Каталог товарів",
      isCatalog: true,
      userId: req.user ? req.user._id.toString() : null,
      pharmacy,
      layout: "catalog",
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id/edit", auth, authAdmin,  async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!isOwner(pharmacy, req)) {
      return res.redirect("/catalog");
    }

    res.render("pharmacy-edit", {
      title: `Редагувати ${pharmacy.title}`,
      pharmacy,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", authAdmin, auth,pharmaValidators, async (req, res) => {
  const errors = validationResult(req);
  
  // if(!errors.isEmpty()){
  //   return res.status(422).redirect(`/catalog/${id}/edit?allow=true`)
  // }

  try {
    const { id } = req.body;
    delete req.body.id;
    const pharma = await Pharmacy.findById(id);
    if (!isOwner(pharma, req)) {
      return res.redirect("/catalog");
    }
    Object.assign(pharma, req.body);
    await pharma.save();
    res.redirect("/catalog");
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", auth, authAdmin, async (req, res) => {
  try {
    await Pharmacy.deleteOne({ _id: req.body.id, userId: req.user._id });
    res.redirect("/catalog");
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try{const pharmacy = await Pharmacy.findById(req.params.id);
  res.render("pharmacy-open", {
    title: `${pharmacy.title}`,
    pharmacy,
  });}
  catch(e){
    console.log(e);
  }
  
});

router.post('/filters', (req, res) => {
  try{
    s = req.body.elem;
    // console.log(s + 'filters');
    res.redirect('/catalog');
  }
  catch(e){
    console.log(e);
  }
  
})

router.post('/search', (req, res) => {
  a = req.body.search;
  res.redirect('/catalog')
  // console.log(a);
})

// router.get("/filters",  async (req, res) => {
//   res.render("/", {
//     title: `Редагувати`,
//   });
// });

module.exports = router;
