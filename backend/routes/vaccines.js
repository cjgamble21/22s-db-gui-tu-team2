
const bcrypt = require('bcryptjs');
const pool = require('../db');
const express = require('express');
const e = require('express');
const router = express.Router();


//get all vaccines or filter by name AND manufacturer
router.get('/', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err)
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      // if there is no issue obtaining a connection, execute query and release connection
      const vacc_name = req.query.name
      const vacc_man = req.query.manufacturer
      if (vacc_name && vacc_man) {
        connection.query('SELECT * FROM `vaccine_app`.`vaccine` WHERE name = ? AND manufacturer = ?', [vacc_name, vacc_man], function (err, rows, fields) {
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

router.get('/:id', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err)
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      conn.query('SELECT * FROM vaccine_user WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (err) {
          logger.error("Error fetching vaccines", err);
          res.status(200).json({
            "Error": "Error fetching vaccines"
          })
        } else {
          res.status(200).json({
            "data": rows
          })
        }
      });
    }
  })
})
module.exports = router;