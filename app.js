require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
var cors = require('cors'); // <== Thêm thư viện CORS để Frontend gọi API không bị chặn

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 🚀 CORS: Cho phép mọi Frontend gọi API + gửi cookie cross-origin
app.use(cors({
  origin: function (origin, callback) {
    // Cho phép mọi origin (bao gồm localhost, vercel, v.v.)
    callback(null, origin || true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Kết nối Database qua biến môi trường (MongoDB Atlas)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối Database thành công!'))
  .catch((err) => console.error('Lỗi kết nối DB:', err));

// KHAI BÁO CÁC ĐƯỜNG DẪN API (ROUTES)
app.use('/api/v1/', require('./routes/index'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/inventories', require('./routes/inventories'));
app.use('/api/v1/carts', require('./routes/carts'));
app.use('/api/v1/upload', require('./routes/upload'));
app.use('/api/v1/orders', require('./routes/orders')); 
app.use('/api/v1/reviews', require('./routes/reviews')); 
app.use('/api/v1/vouchers', require('./routes/vouchers')); 
app.use('/api/v1/chats', require('./routes/chats')); // 🚀 <== ĐÃ MỞ CỔNG CHO TRUNG TÂM NHẮN TIN (CHATS)
app.use('/api/v1/reservations', require('./routes/reservations')); // 🚀 <== CỔNG MỚI CHO GIỮ HÀNG

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;