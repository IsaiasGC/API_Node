const express = require('express');
const morgan = require('morgan');
const http = require('http');
const app = express();

// Setings
app.set('port', process.env.PORT || 8888);

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// Routes
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/user/types', require('./routes/userTypes.routes'));
app.use('/api/schedules', require('./routes/schedules.routes'));
app.use('/api/deliveries', require('./routes/deliveries.routes'));
app.use('/api/courses', require('./routes/courses.routes'));
app.use('/api/comments/advertisement', require('./routes/commentsAdvertisement.routes'));
app.use('/api/comments/activity', require('./routes/commentsActivity.routes'));
app.use('/api/advertisement', require('./routes/advertisements.routes'));
app.use('/api/activities', require('./routes/activities.routes'));

// Static files


//Create Server
const server=http.createServer(app);

process.on('uncaughtException', function(err) {
  console.log(err);
});

// Starting the Server
server.listen(app.get('port'),()=>{
  console.log('Server classroom on port '+app.get('port'));
});