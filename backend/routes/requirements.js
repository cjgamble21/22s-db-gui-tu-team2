const pool = require('../db');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
//authenticate jwt
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


router.post('/', (req, res) =>{
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
      connection.query('INSERT INTO requirement (`inst_name`,`inst_add`,`vacc_name`,`vacc_manu`) VALUES(?,?,?,?)',[payload.inst_name,payload.inst_add,payload.vacc_name,payload.vacc_manu], function (err, rows, fields) {
        connection.release();
        if (err) {
          // if there is an error with the query, log the error
          logger.error("Problem inserting into table: \n", err);
          res.status(400).send('Problem inserting into table'); 
        } else {
          res.status(200).send(`added ${payload.vacc_name} as a vaccine for ${payload.inst_name}`);
        }
      });
    }
  });
});


router.delete('/', (req, res) =>{
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
        connection.query('DELETE FROM requirement WHERE `inst_name` = ? AND `inst_add` = ? AND `vacc_name` = ? AND `vacc_manu` = ?',[payload.inst_name,payload.inst_add,payload.vacc_name,payload.vacc_manu], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem deleting record: \n", err);
            res.status(400).send('Problem deleting record'); 
          } else {
            res.status(200).send(`deleted ${payload.vacc_name} as a vaccine for ${payload.inst_name}`);
          }
        });
      }
    });
  });

  router.get('/', (req, res) =>{
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
        connection.query('Select * FROM requirement WHERE `inst_name` = ? AND `inst_add` = ? ',[payload.inst_name,payload.inst_add], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem selecting records: \n", err);
            res.status(400).send('Problem selecting records:'); 
          } else {
            res.status(200).json({
                "data":rows
            });
          }
        });
      }
    });
  });


  //put route for requirement
  router.put('/', (req, res) =>{
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
        connection.query('UPDATE requirement SET `inst_name` = ?, `inst_add` = ?, `vacc_name` = ?, `vacc_manu` = ? WHERE `inst_name` = ? AND `inst_add` = ? AND `vacc_name` = ? AND `vacc_manu` = ?',[payload.inst_name,payload.inst_add,payload.vacc_name,payload.vacc_manu,payload.inst_name,payload.inst_add,payload.vacc_name,payload.vacc_manu], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem updating record: \n", err);
            res.status(400).send('Problem updating record'); 
          } else {
            res.status(200).send(`updated ${payload.vacc_name} as a vaccine for ${payload.inst_name}`);
          }
        });
      }
    });
  });






  

module.exports = router;