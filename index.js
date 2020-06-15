const express = require("express");
const fs = require("fs");
const csrf = require('csurf');
const flash = require('connect-flash');
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session)

const homeRoutes = require('./routes/home.js')
const catalogRoutes = require('./routes/catalog.js')
const addRoutes = require('./routes/add.js');
const basketRoutes = require('./routes/basket.js');
const orderRoutes = require('./routes/orders.js');
const authRoutes = require('./routes/auth.js');
const User = require("./models/user");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const keys = require('./keys/index');

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require('./utils/hbs-helpers'),
});
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
})


app.engine("hbs", hbs.engine); //кажемо експресу, що є такий двіжок, і передаємо його значення
app.set("view engine", "hbs"); //Використовуємо двіжок
app.set("views", "views"); //Де будуть зберігатися наші шаблони


app.use(express.static("public")); //папка паблік буде статична і публічна
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}))
app.use(csrf());//після сесії
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/',homeRoutes);
app.use('/catalog',catalogRoutes);
app.use('/add',addRoutes);
app.use('/basket',basketRoutes);
app.use('/orders',orderRoutes);
app.use('/auth',authRoutes);
app.use(errorHandler);


const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology:true
    });

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
