const pool = require('./db')

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
  app.get('/health', (req,res) => {
    const responseBody = { status: 'up', port:'8000' };
    response.json(responseBody);
  });

  // POST /multplynumber
  app.post('/multplynumber', (req, res) => {
    console.log(req.body.product);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
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
  app.post('/users', (req, res) => {
    console.log(req.body);
    const payload = req.query;
    console.log(payload);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO user (`first_name`,`last_name`,`age`,`username`,`password`) VALUES(?,?,?,?,?)',[payload.first_name,payload.last_name,payload.age,payload.username,payload.password], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).send(`added ${req.query.first_name} to the table!`)
          }
        });
      }
    });
  });
  // GET /checkdb
  app.get('/users', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT first_name,last_name, age FROM `vaccine_app`.`user`', function (err, rows, fields) {
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
    });
  });

  //get vaccines info
  app.get('/vaccine', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT * FROM `vaccine_app`.`vaccine`', function (err, rows, fields) {
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
    });
  });
  //get vaccines for a certain user
  app.get('/vaccine_doses', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        const username = req.query.username;
        if(username){
          connection.query('SELECT * FROM `vaccine_app`.`vaccine_user` WHERE username = ? ',[username], function (err, rows, fields) {
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
        }else{
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
}