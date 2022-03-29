const bcrypt = require('bcryptjs');
const pool = require('../db');
const express = require('express');
const router = express.Router();
router.post('/', (req, res) => {
    const payload = req.body;
    const password = payload.password;
    const salt = bcrypt.genSaltSync(10);
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
            res.status(200).send(`added ${req.body.first_name} ${payload.last_name} to the table!`);
          }
        });
      }
    });
  });


  router.post('/:id/viewers', (req, res) => {
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
        connection.query('INSERT INTO viewer (`record_holder`,`viewer`,`relationship`) VALUES(?,?,?)',[id,payload.viewer_email,payload.relation], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).send(`added ${payload.viewer_email} as a viewer for ${id}`);
          }
        });
      }
    });
  });


  router.get('/:id/viewers', (req, res) => {
    // obtain a connection from our pool of connections
    const id = req.params.id;
    console.log(req.params); 
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT viewer, first_name,last_name FROM `vaccine_app`.`viewer` JOIN user t on t.email = viewer.viewer WHERE record_holder = ?',[id], function (err, rows, fields) {
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

  router.get('/', (req, res) => {
   
    
    
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('select * from user', function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).json({
                "data":rows
            });
          }
        });
      }
    });
  });
  router.get('/:id', (req, res) => {
   
    const id = req.params.id; 
    
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('select * from user where username = ?',[id], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).json({
                "data":rows
            });
          }
        });
      }
    });
  });
  module.exports = router;