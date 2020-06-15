const { body, validationResult } = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
  .isEmail()
    .withMessage("Введіть коректний email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Такий email вже зайнятий");
        }
      } catch (e) {
        console.log(e);
      }
    }),
    // .normalizeEmail()
  body("password", "Пароль повинен бути не меньше 6 символів")
    .isLength({ min: 6, max: 30 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Паролі повинні співпадати");
    }
    return true;
  })
  .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage(`Ім'я повинне містити не меньше 3 символів`)
    .trim(),
];

exports.pharmaValidators = [
    body('title').isLength({min: 3})
    .withMessage('Мінімальна довжина 3 символи')
    .trim(),
    body('price').isNumeric().withMessage('Введіть коректну ціну'),
    body('img', 'Введіть коректний Url картинки').isURL()
]