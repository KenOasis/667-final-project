if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const app = express();


// Setup for session
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models/');

const extendDefaultFields = (defaults , session) => {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId,
    userName: session.userName
  };
};

const store = new sequelizeStore({
  db: db.sequelize,
  table: 'session',
  extendDefaultFields: extendDefaultFields
});

// end of setup session
const errorController = require('./controllers/static/errors');

const userRoutes = require('./routes/api/user-routes');
const staticRoutes = require('./routes/static/static-routes');
const gameTestRoutes = require('./routes/tests/core');
const errorRoutes = require('./routes/errors');
const routerFilter = require('./middleware/router-filter');
app.set('view engine', 'pug');
app.set('views', 'views');


app.use(session({
  secret: "This is the secret",
  store: store,
  resave: false,
  saveUninitialized: false
}));

store.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routerFilter);

app.use('/', staticRoutes.routes);
app.use('/user', userRoutes.routes);
app.use('/tests', gameTestRoutes.routes);

app.use(errorRoutes.routes);

let port_number = process.env.PORT || 3000;
const server = app.listen(port_number);
const io = require('./socket').init (server);
io.on('connection', socket => {
  console.log("client connectted " + socket.id );
})