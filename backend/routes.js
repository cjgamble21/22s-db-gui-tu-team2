const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
let refreshTokens = [];

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = function routes(app, logger) {
  // GET /
  app.get('/', (req, res) => {
    res.status(200).send('Go to 0.0.0.0:3000.');
  });

  // POST /reset
  // app.post('/reset', (req, res) => {
  //   // obtain a connection from our pool of connections
  //   pool.getConnection(function (err, connection){
  //     if (err){
  //       console.log(connection);
  //       // if there is an issue obtaining a connection, release the connection instance and log the error
  //       logger.error('Problem obtaining MySQL connection', err)
  //       res.status(400).send('Problem obtaining MySQL connection'); 
  //     } else {
  //       // if there is no issue obtaining a connection, execute query
  //       connection.query('drop table if exists test_table', function (err, rows, fields) {
  //         if (err) { 
  //           // if there is an error with the query, release the connection instance and log the error
  //           connection.release()
  //           logger.error("Problem dropping the table test_table: ", err); 
  //           res.status(400).send('Problem dropping the table'); 
  //         } else {
  //           // if there is no error with the query, execute the next query and do not release the connection yet
  //           connection.query('CREATE TABLE `db`.`test_table` (`id` INT NOT NULL AUTO_INCREMENT, `value` VARCHAR(45), PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);', function (err, rows, fields) {
  //             if (err) { 
  //               // if there is an error with the query, release the connection instance and log the error
  //               connection.release()
  //               logger.error("Problem creating the table test_table: ", err);
  //               res.status(400).send('Problem creating the table'); 
  //             } else { 
  //               // if there is no error with the query, release the connection instance
  //               connection.release()
  //               res.status(200).send('created the table'); 
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // });

  //health route
  app.get('/health', (req, res) => {
    const responseBody = { status: 'up', port: '8000' };
    response.json(responseBody);
  });

  // POST /multplynumber
  app.post('/multplynumber', (req, res) => {
    console.log(req.body.product);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO `db`.`test_table` (`value`) VALUES(\'' + req.body.product + '\')', function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table');
          } else {
            res.status(200).send(`added ${req.body.product} to the table!`);
          }
        });
      }
    });
  });
  //post for users
  const bodyParser = require('body-parser');


  app.use(bodyParser.json());

  //post for vaccine side affects
  app.post('/side-affects', (req, res) => {
    console.log(req.body);
    const payload = req.body;
    console.log(payload);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO side_affects (`vacc_name`,`vacc_manu`,`side_affect`) VALUES(?,?,?)', [payload.name, payload.manufacturer, payload.side_affect], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table');
          } else {
            res.status(200).send(`added ${payload.side_affect} to the table for vaccine ${payload.name} made by ${payload.manufacturer}`);
          }
        });
      }
    });
  });
  //add new viewer to account



  //authenticate user
  app.post('/session', (req, res) => {

    const payload = req.body;
    const password = payload.password;
    console.log(payload);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT * FROM user WHERE username = ?', [payload.username], function (err, rows, fields) {
          connection.release();
          // console.l??og(rows);
          const user = rows[0];
          console.log(user);

          const validPassword = bcrypt.compareSync(password, user.password);

          console.log(validPassword);
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table');
          } else {
            if (validPassword) {
              const accessToken = jwt.sign({ username: user.username, id: user.id }, accessTokenSecret);
              const refreshToken = jwt.sign({ username: user.username }, refreshTokenSecret);

              refreshTokens.push(refreshToken);

              res.json({
                accessToken,
                refreshToken
              });
            } else {
              res.send('Username or password incorrect');
            }
          }
        });

      }
    });
  });


  app.post('/logout', (req, res) => {

    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);


    res.send("Logout successful");
  });



  //get vaccines info
  //get vaccine side effects route
  app.get('/side-affects', (req, res) => {
    const vacc_name = req.query.name;
    const vacc_man = req.query.manufacturer;
    console.log(req.query);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection

        if (vacc_name && vacc_man) {
          connection.query('SELECT (side_affect) FROM `vaccine_app`.`side_affects` WHERE vacc_name = ? AND vacc_manu = ?', [vacc_name, vacc_man], function (err, rows, fields) {
            connection.release();
            if (err) {
              logger.error("Error while fetching values: \n", err);
              res.status(400).json({
                "data": [],
                "error": "Error obtaining values"
              })
            } else {
              res.status(200).json({
                "data": rows
              });
            }
          });
        } else {
          connection.query('SELECT * FROM `vaccine_app`.`side_affects`', function (err, rows, fields) {
            connection.release();
            if (err) {
              logger.error("Error while fetching values: \n", err);
              res.status(400).json({
                "data": [],
                "error": "Error obtaining values"
              })
            } else {
              res.status(200).json({
                "data": rows
              });
            }
          });
        }
      }
    });
  });
  //get vaccines for a certain user
  app.get('/vaccine_doses', authenticateJWT, (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        const username = req.query.username;
        console.log(username);
        if (username) {
          connection.query('SELECT * FROM `vaccine_app`.`vaccine_user` WHERE username = ?', [username], function (err, rows, fields) {
            connection.release();
            if (err) {
              logger.error("Error while fetching values: \n", err);
              res.status(400).json({
                "data": [],
                "error": "Error obtaining values"
              })
            } else {
              res.status(200).json({
                "data": rows
              });
            }
          });
        } else {
          connection.query('SELECT * FROM `vaccine_app`.`vaccine_user`', function (err, rows, fields) {
            connection.release();
            if (err) {
              logger.error("Error while fetching values: \n", err);
              res.status(400).json({
                "data": [],
                "error": "Error obtaining values"
              })
            } else {
              res.status(200).json({
                "data": rows
              });
            }
          });

        }
      }
    });
  });

  //delete viewer of record


  app.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
      return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign({ username: user.username }, accessTokenSecret, { expiresIn: '1m' });

      res.json({
        accessToken
      });
    });
  });
}