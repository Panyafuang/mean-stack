const http = require('http');
const debug = require('debug')('node-angular');

const app = require('./backend/app');



/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  var port = parseInt(val, 10);
  if(isNaN(port)) {
    return val; // name pipe
  }
  if(port >= 0) {
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
  if(error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + PORT;
  switch(error.code) {
    case 'EACCES':
      console.log(bind + ' requires elevated privileges'); // ต้องการสิทธิพิเศษระดับสูง
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + PORT;
  debug('Listening on ' + bind);
}

const PORT = normalizePort(process.env.PORT || '3000');
/** Set configuration for express environment */
app.set('port', PORT); // Tell express wich port we're working


const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.on('error', onError);
server.on('listening', onListening);
server.listen(PORT);

console.log(server.address());
