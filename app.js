if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const app = express();
const errorController = require('./controllers/errors');
const showCardsRoutes = require('./routes/showCards');
const usersRoutes = require('./routes/users');
const homeRoutes = require('./routes/home');
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoutes.routes);
app.use('/showCards', showCardsRoutes.routes);
app.use('/users', usersRoutes.routes);
app.use(errorController.Error404);

let port_number = process.env.PORT || 3000;
app.listen(port_number);