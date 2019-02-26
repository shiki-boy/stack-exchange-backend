const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const {
  stack_exchangeConn
} = require('./db/mongoose');

var {checkSession,authenticate} = require('./middleware/authenticate')


var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({            // ? parses text as url encoded data "POST"
extended: false
}));

app.use(bodyParser.json());               // ?  converts json into object

// ! CORS
var corsOptions = {
  origin: 'http://localhost:8080',
  credentials:true,
  exposedHeaders: ['x-auth'], // ? for axios to access all headers due to cors
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

// ! COOKIE STORE
app.use(session({
  secret:'MYSECRET',
  saveUninitialized:false,
  resave:false,
  store: new MongoStore({
    mongooseConnection: stack_exchangeConn,
    ttl:60*60    // * 1hr in sec
  })
}))

const router = require('./api/api.js');   // ? refactoring code files
app.use(router);

var fake = require('./api/faker.js');
app.use('/faker',fake);

var tagsService = require('./api/tagsService.js');
app.use('/tags',tagsService);

var userApi = require('./api/user.js');
app.use('/user',userApi);

app.get('/test',(req,res)=>{
  console.log(req.session.user);
  // req.session.user = 'abc'
  res.send('done')
})

app.get('/testCookie',checkSession,authenticate,(req,res)=>{
  // if(req.session.user){
    console.log('ll');
    res.send(req.session.user)
  // }
  // else{
  //   res.send('no cookie')
  // }
})

var d = new Date();
app.listen(port, () => {
    console.log(`Server Started on ${port}  --${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
});

module.exports = app