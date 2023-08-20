import express from 'express';
import routes from './routes';
//import config from './config/constants';
import bodyParser from 'body-parser';

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');

dotenv.config( { path : './config.env'} )
const PORT = process.env.PORT || 3000

const app = express();

app.use(bodyParser.json());

app.use('/api', routes);
var indexRouter = require('../src/routes/index');
app.use('/', indexRouter);

// view engine setup
app.set('views', path.join(__dirname, '../src/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`
    Title : Project1
    Port: ${PORT}
    Env: ${app.get('env')}
  `);
});