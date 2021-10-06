const express = require('express');
const path = require('path');
const app = express();
const errorController = require('./controllers/errors');
const testRoutes = require('./routes/test');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(testRoutes.routes);
app.use(errorController.Error404);


let port_number = process.env.PORT || 3000;
app.listen(port_number);
console.log("Server run at port : " + port_number);
