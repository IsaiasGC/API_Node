const express = require('express');
const morgan = require('morgan');
const http = require('http');
const app = express();

// Setings
app.set('port', process.env.PORT || 8888);

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users.routes'));

// Static files

//Create Server
const server=http.createServer(app);

// Starting the Server
server.listen(app.get('port'),()=>{
  console.log('Server classroom on port '+app.get('port'));
});