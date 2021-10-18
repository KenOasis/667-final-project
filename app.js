if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const app = express();
const errorController = require('./controllers/errors');
const testRoutes = require('./routes/testMain');
const testDBRoutes = require('./routes/testdb');
const loginTest = require('./controllers/test');
const registerTest = require('./controllers/test');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(testRoutes.routes);
app.use('/tests', testDBRoutes.routes);
app.use('/login', loginTest.login);
app.use('/register', registerTest.register)
app.use(errorController.Error404);

console.log(process.env.NODE_ENV);
let port_number = process.env.PORT || 3000;
app.listen(port_number);
