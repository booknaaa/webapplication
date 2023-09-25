const express = require ( 'express');
const routes  = require ('./src/routes/routes');

//import config from './config/constants';
const bodyParser = require ('body-parser');
const db = require('./src/db/models');

const flash = require('connect-flash');
const expressSession = require('express-session');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');

dotenv.config( { path : './config.env'} )
const PORT = process.env.PORT || 3000

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO('https://project1-rho-eight.vercel.app');
//const socket = io(' https://project1-666w43tll-booknaaa.vercel.app');
//const YAML = require('yamljs'); // หรือใช้ไลบรารี JSON หากไฟล์ Swagger Specification เป็น JSON

//const swaggerDocument = YAML.load('src/swagger.yaml'); // ระบุพาธไปยังไฟล์ Swagger Specification ของคุณ

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// กำหนด middleware โดยใช้ Path Pattern
// ทุก request จะต้องมี path ที่ขึ้นต้นด้วย ค่าที่เรา config ไว้ในไฟล์ constants
app.use(bodyParser.json());

// view engine setup
const viewpath = path.join(__dirname , 'views');
app.set('views', viewpath);
app.set('view engine', 'ejs');
//console.log(viewpath);

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src/public')));

app.use(flash())

app.use(expressSession({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
/*app.use(expressSession({
  secret: "node secret"
}))
global.loggedIn = null
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId
  next()
})*/

app.use('/api', routes);
app.use('/', routes);
app.use('/register', routes);
app.use('/login', routes);
app.use('/home', routes);
app.use('/logout', routes);
app.use('/user/me', routes);
app.use('/post', routes);
app.use('/admin', routes);


/*db.sequelize.sync().then(() => {
  server.listen(PORT), () => {
    console.log(`
    Title : Project1
    Port: ${PORT}
    Env: ${app.get('env')}
    Server is running on port ${port}
  `);
  }});*/
server.listen(PORT, () => {
  console.log(`
  Title : Project1
  Port: ${PORT}
  Env: ${app.get('env')}
  Server is running on port ${PORT}
`);
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  let interval; 
  socket.on('stopSerial', () => {
    console.log('Stop Serialport');
    if (interval) {
      clearInterval(interval); // หยุดการส่งข้อมูลด้วยการล้าง interval เฉพาะเมื่อ interval มีค่าไม่เท่ากับ undefined
    }
  });
  
  socket.on('startSerial', () => {
    console.log('Start Serialport');
    if (!interval && typeof global.myValue !== 'undefined') {
      interval = setInterval(() => {
        io.emit('serialData', global.myValue); // ส่งข้อมูลไปยังไคลเอ็นต์ทุกๆ 1 วินาที

      }, 5000); // ส่งข้อมูลทุกๆ 5 วินาที หาก interval ยังไม่ถูกสร้าง
    }
  });
  
});


const socket = io('https://final-project6-2.vercel.app/');

socket.on('connect', () => {
  console.log('Connected to Socket.io server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.io server');
});