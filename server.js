const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { JWTStrategy } = require('./services/jwt.service');
const passport = require('passport');
const cors = require('cors');
//const SocketIO = require('./modules/io/socket');

// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'https://databases-auth.000webhost.com',
    user: 'id9064819_root',
    password: 'abc12345',
    database: 'id9064819_da_kthdv'
  });
  var connection;

  function handleDisconnect() {
      console.log('1. connecting to db:');
      connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                      // the old one cannot be reused.
  
      connection.connect(function(err) {              	// The server is either down
          if (err) {                                     // or restarting (takes a while sometimes).
              console.log('2. error when connecting to db:', err);
              setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
          }                                     	// to avoid a hot loop, and to allow our node script to
      });                                     	// process asynchronous requests in the meantime.
                                                  // If you're also serving http, display a 503 error.
      connection.on('error', function(err) {
          console.log('3. db error', err);
          if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
              handleDisconnect();                      	// lost due to either server restart, or a
          } else {                                      	// connnection idle timeout (the wait_timeout
              throw err;                                  // server variable configures this)
          }
      });
  }
  
require('dotenv').config();

/**
* Passport uses jwt strategy.
*/
passport.use(JWTStrategy);

/**
* @module Server
* @requires module:express
* @requires module:dotenv
* @requires module:body-parser
* @requires module:routes
*/
/**
* @class
* @classdesc Server class describes http server including with express framework.
* @property {object} express - instance express framework
*/
class Server {
    constructor() {
        this.express = express();
    }

    /**
    * @description This method runs server.
    * @return {void}
    */
    run() {
        const { PORT } = process.env;
        handleDisconnect();
        this.express.use(
            cors({
                origin: '*',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  
            }),
        );

        this.express.use(passport.initialize());
        this.express.use(bodyParser.json({limit: '10mb', extended: true}));
        this.express.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
        this.express.use('/api', routes);    
        this.express.get('/', (req, res) => {
            res.send("Helllo ");
        })
        this.express.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
    }
}

/**
* If this module is not main runs the server.
*/
if (!module.parent) {
    return new Server().run();
}

module.exports = Server;