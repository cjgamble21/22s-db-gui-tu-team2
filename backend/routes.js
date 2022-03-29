const pool = require('./db');
const bcrypt = require('bcryptjs');



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
    console.log(req.query);
    const payload = req.body;
    const password = payload.password;
    // const salt = bcrypt.genSaltSync(10);
    const hashword = bcrypt.hashSync(password, 10);
    
    console.log(payload);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO user (`first_name`,`last_name`,`age`,`username`,`password`,`email`) VALUES(?,?,?,?,?,?)',[payload.first_name,payload.last_name,payload.age,payload.username,hashword,payload.email], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).send(`added ${req.body.first_name} to the table!`)
          }
        });
      }
    });
  });
  //post for vaccine side affects
  app.post('/side-affects', (req, res) => {
    console.log(req.body);
    const payload = req.body;
    console.log(payload);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO side_affects (`vacc_name`,`vacc_manu`,`side_affect`) VALUES(?,?,?)',[payload.name,payload.manufacturer,payload.side_affect], function (err, rows, fields) {
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
  app.post('/users/viewers/:id', (req, res) => {
    console.log(req.body);
    const payload = req.body;
    const id = req.params.id;
   
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO viewer (`record_holder`,`viewer_email`,`relationship`) VALUES(?,?,?)',[id,payload.viewer_email,payload.relation], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).send(`added ${payload.viewer} as a viewer for ${id}`);
          }
        });
      }
    });
  });
  app.post('/users/:id/dose', (req, res) => {
    console.log(req.body);
    const payload = req.body;
    const id = req.params.id;
    console.log(payload);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO vaccine_user (`username`,`name`,`manufacturer`,`date`,`private`,`image`) VALUES(?,?,?,?,?,?)',[id,payload.name,payload.manufacturer,payload.date,payload.private,payload.image], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).send(`added ${payload.name} as a vaccine for ${id}`);
          }
        });
      }
    });
  });

  //authenticate user
  app.post('/session',  async (req, res) => {
    console.log(req.body);
    const payload = req.body;
    const password = payload.password;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('Select * from user WHERE email = ? OR username = ? ',[payload.email, payload.username], (err, rows, fields) => {
          
          const user = rows[0];
          console.log(password + " " + user.password);
          
          const validPassword = bcrypt.compareSync(password, user.password);
          console.log(validPassword);
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(201).json(validPassword);
          }
        });
        connection.release();
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
  // GET specific user
  app.get('/users/:id', (req, res) => {
    // obtain a connection from our pool of connections
    const id = req.params.id;
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT first_name,last_name, age FROM `vaccine_app`.`user` WHERE username = ?',[id], function (err, rows, fields) {
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

  //see who can view your vaccination status
  app.get('/users/viewers/:id', (req, res) => {
      // obtain a connection from our pool of connections
      const id = req.params.id;
      pool.getConnection(function (err, connection){
        if(err){
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection',err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else {
          // if there is no issue obtaining a connection, execute query and release connection
          connection.query('SELECT viewer, first_name,last_name FROM `vaccine_app`.`viewer` JOIN user t on t.username = viewer.viewer WHERE record_holder = ?',[id], function (err, rows, fields) {
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
        const vacc_name = req.query.name
        const vacc_man = req.query.manufacturer 
        if(vacc_name && vacc_man){
          connection.query('SELECT * FROM `vaccine_app`.`vaccine` WHERE name = ? AND manufacturer = ?', [vacc_name,vacc_man], function (err, rows, fields) {
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
      }
    });
  });
  //get vaccine side effects route
  app.get('/side-affects', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        const vacc_name = req.query.name
        const vacc_man = req.query.manufacturer 
        if(vacc_name && vacc_man){
          connection.query('SELECT (side_affect) FROM `vaccine_app`.`side_affects` WHERE vacc_name = ? AND vacc_manu = ?', [vacc_name,vacc_man], function (err, rows, fields) {
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

  //delete viewer of record
  app.delete('/users/viewers/:id', (req,res) =>{
    const id = req.params.id;
    const view = req.query.viewer
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('DELETE from viewer WHERE record_holder = ? AND viewer = ?',[id, view] , function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).send(`Deleted ${view} as a viewer for ${id}`);
          }
        });
      }
    });
  });

  //delete vaccine from record
  app.delete('/users/:id', (req,res) =>{
    const id = req.params.id;
    const name = req.query.name
    const manu = req.query.manufacturer
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('DELETE from vaccine_user WHERE username = ? AND name = ? AND manufacturer = ?',[id, manu,name ] , function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).send(`Deleted ${view} as a viewer for ${id}`);
          }
        });
      }
    });
  });
}