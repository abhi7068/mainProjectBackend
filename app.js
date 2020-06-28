const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const passport = require('passport');
const indexRouter = require('./routes/index');
const products = require('./routes/products');
const categories = require('./routes/categories');
const profileRouter = require('./routes/profileDetails');
const signUpRouter = require('./routes/signUp');
const logInRouter = require('./routes/logIn');
const googleRouter = require('./routes/googleAuth');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/orders');
const reviewRouter = require('./routes/review');
const redeemRouter = require('./routes/redeem');
const commentRouter = require('./routes/comment');
const app = express();

app.use(cors());
app.use(passport.initialize());
require('./config/passport');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/redeem', redeemRouter);
app.use('/cart', cartRouter);
app.use('/signUp', signUpRouter);
app.use('/logIn', logInRouter);
app.use('/categories', categories);
app.use('/products', products);
app.use('/profileDetails', profileRouter);
app.use('/google', googleRouter);
app.use('/order', orderRouter);
app.use('/review', reviewRouter);
app.use('/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(keys.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.on('connected', () => console.log('CONNECTED'));

module.exports = app;
