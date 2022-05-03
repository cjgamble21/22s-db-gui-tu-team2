const bcrypt = require('bcryptjs');
var async = require("async");
const pool = require('../db');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jsondiff = require('json-diff');
const accessTokenSecret = 'youraccesstokensecret';
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

const ret = (data, res) => {
  res.status(201).json({"data":data});
}

const parsejwt = (token, next) => {
  const res = jwt.decode(token);
  return res;
};

const get_bad_users = (members,email, connection, res) => { 
  let missing = [];
  
  async.forEachOf(members, (member, key, callback) => {
    connection.query('SELECT DISTINCT vacc_name FROM (select vacc_name from requirement where inst_name = (SELECT name FROM institution WHERE admin_email = ?))t LEFT JOIN (select name from vaccine_user where username = ?)k ON t.vacc_name = k.name WHERE k.name IS NULL', [email, member.username], function (err, rows, fields) {
      if (err) {
        console.log('error\n');
        console.log(err);
        callback(err);
      }
      else {
        if (rows.length > 0) {
          missing.push(member);
          console.log(member);
          callback(null);
        }
      }

      });
    
    });
    return missing;






 }


const get_admins = (viewers, next) => {
  console.log(viewers);
  const admins = viewers.filter(admin => admin.admin === 1);
  
  // console.log(admins);
  return admins; 

};

const get_emails = (admins, next) => {
  const emails = admins.map(admin => admin.viewer);
  // console.log(emails);
  return emails;
}


const get_adds = (insts, next) => {
  const adds = insts.map(inst => inst.address);
  // console.log(adds);
  return adds;
}

const get_inst_names = (insts, next) => { 
  const inst_names = insts.map(inst => inst.name);
  // console.log(inst_names);
  return inst_names;
}
router.post('/:id/dose', (req, res) => {
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
//default route
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
        if (!payload.admin){
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
        else{
      
      connection.query('INSERT INTO user (`first_name`,`last_name`,`age`,`username`,`password`,`email`,`admin`) VALUES(?,?,?,?,?,?,?)',[payload.first_name,payload.last_name,payload.age,payload.username,hashword,payload.email,payload.admin], function (err, rows, fields) {
        // connection.release();
        if (err) {
          // if there is an error with the query, log the error
          logger.error("Problem inserting into test table: \n", err);
          res.status(400).send('Problem inserting into table'); 
         } else {
          connection.query('INSERT INTO `vaccine_app`.`institution`VALUES(?,?,?,?,?)',[payload.institution_name,payload.institution_address,payload.institution_type,payload.institution_description,payload.email],function (err, rows, fields){
            connection.release();
            if (err) {
              // if there is an error with the query, log the error
              logger.error("Problem inserting into institution table: \n", err);
              res.status(400).send('Problem creating institution'); 
            } else {
              res.status(200).send(`added ${payload.institution_name} with admin: ${payload.email} to the table!`);
            } 
            
          });
          
        }
      });
      // connection.query('INSERT INTO `vaccine_app`.`institution`VALUES(?,?,?,?,?)',[payload.institution_name,payload.institution_address,payload.institution_type,payload.institution_description,payload.email],function (err, rows, fields){
      //   connection.release();
      //   if (err) {
      //     // if there is an error with the query, log the error
      //     logger.error("Problem inserting into institution table: \n", err);
      //     res.status(400).send('Problem creating institution'); 
      //   } else {
      //     res.status(200).send(`added ${payload.institution_name} with admin: ${payload.email} to the table!`);
      //   } 
        
      // });
      
    }
    
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
   //delete vaccine from record
  router.delete('/:id', (req,res) =>{
    const id = req.params.id;
    const name = req.body.name;
    const manu = req.body.manufacturer;
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('DELETE from vaccine_user WHERE username = ? AND name = ? AND manufacturer = ?',[id, name, manu] , function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).send(`Deleted ${name}  from user ${id}`);
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

  router.put('/:id',authenticateJWT, (req, res) =>{
    const id = req.params.id; 
    console.log(req.body);
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('Update user SET first_name = IFNULL(?, first_name), last_name = IFNULL(?, last_name), age = IFNULL(?, age),email = IFNULL(?, email), username = IFNULL(?, username) WHERE ID = ?',[req.body.first_name, req.body.last_name, req.body.age, req.body.email,req.body.username,id], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem updating the table: \n", err);
            res.status(400).send('Problem updating the table:'); 
          } else {
            res.status(200).json({
                "data":rows
            });
          }
        });
      }
    });
  });

  // router.get('/:username/requirements', (req, res) => {
  //   const username = req.params.username;
  //   console.log(req.body);
  //   pool.getConnection(function (err, connection){
  //     if(err){
  //       // if there is an issue obtaining a connection, release the connection instance and log the error
  //       logger.error('Problem obtaining MySQL connection',err)
  //       res.status(400).send('Problem obtaining MySQL connection'); 
  //     } else {
  //       // if there is no issue obtaining a connection, execute query and release connection
  //       connection.query('SELECT name, manufacturer FROM `vaccine_app`.`vaccine_user` WHERE username = ?',[username], function (err, rows, fields) {
  //         if (err) {
  //           // if there is an error with the query, log the error
  //           logger.error("Problem updating the table: \n", err);
  //           res.status(400).send('Problem updating the table:'); 
  //         } else {
  //           curr_vacc = rows;
  //           connection.query('SELECT viewer, admin  FROM viewer JOIN user t on t.email = viewer.viewer WHERE record_holder = ?',[username], function (err, rows, fields) {
  //             connection.release();
  //           if (err) {
  //             // if there is an error with the query, log the error
  //             logger.error("Problem getting vieweres: \n", err);
  //             res.status(400).send('Problem getting viewers:'); 
  //           } else {
  //             const admins = get_admins(rows);
  //             const ad=JSON.parse(JSON.stringify(admins));
              
  //             const em = get_emails(ad);
  //             connection.query('SELECT name, address from institution where admin_email IN (?)',[em], function (err, rows, fields) {
  //               if (err) {
  //                 // if there is an error with the query, log the error
  //                 logger.error("Problem getting institutions: \n", err);
  //                 res.status(400).send('Problem getting institutions:');
  //               } else {
  //                 const inst = JSON.parse(JSON.stringify(rows));
  //                 // console.log(inst);
  //                 //get requirements for institutions
  //                 connection.query('SELECT vacc_manu, vacc_name FROM requirement WHERE inst_add IN (?) AND inst_name IN (?)',[get_adds(inst), get_inst_names(inst)], function (err, rows, fields) {
  //                   if (err){
  //                     // if there is an error with the query, log the error
  //                     logger.error("Problem getting requirements: \n", err);
  //                     res.status(400).send('Problem getting requirements:');
  //                   } else{
                      
  //                     const reqs = JSON.parse(JSON.stringify(rows));

  //                     const remaining = jsondiff.diff(curr_vacc, reqs, {full:1});
  //                     console.log(remaining); 
  //                     res.status(200).json({
  //                       "reqs":remaining
        
  //                   });
  //                   }
  //                 });
                  
  //               }

                
  //             });
              

  //           }
  //         });

            
  //         }
  //       });
  //     }
  //   });
  // });


  //get for reqs
  router.get('/:username/requirements', (req, res) => {
    const username = req.params.username;
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT vacc_manu, vacc_name FROM requirement WHERE inst_add IN (SELECT address from institution where admin_email IN ((SELECT viewer FROM viewer JOIN user t on t.email = viewer.viewer WHERE record_holder = ? AND admin = 1))) AND inst_name IN (SELECT name from institution where admin_email IN ((SELECT viewer FROM viewer JOIN user t on t.email = viewer.viewer WHERE record_holder = ? AND admin = 1))) AND vacc_name NOT IN (SELECT name FROM `vaccine_app`.`vaccine_user` WHERE username = ?)',[username, username, username], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem getting requirements: \n", err);
            res.status(400).send('Problem getting requirements:'); 
          } else {
            res.status(200).json({
                "data":rows
            });
          }
        });
      }
    });
  
  });


  router.get('/:username/requirements/:institution_name/', (req, res) => {
    const username = req.params.username;
    const name = req.params.institution_name;
    console.log(name);
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT vacc_manu, vacc_name FROM requirement WHERE inst_name = ? AND vacc_name NOT IN (SELECT name FROM `vaccine_app`.`vaccine_user` WHERE username = ?)',[name, username], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem getting requirements: \n", err);
            res.status(400).send('Problem getting requirements:'); 
          } else {
            res.status(200).json({
                "data":rows
            });
          }
        });
      }
    });
  
  });

  //get students/workers who havent been vaccinated
  router.get('/admin/missing/',(req, res) => {
    const username = req.params.username;
    const token_info = jwt.decode(req.headers.authorization.split(' ')[1]);
    const email = token_info.email;
    var missing = [];
    if(token_info.admin){
      pool.getConnection((err, connection)=>{
        if(err){
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection',err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else {
          
          // if there is no issue obtaining a connection, execute query and release connection
          connection.query('SELECT first_name, last_name, email, username FROM user WHERE username IN (SELECT record_holder FROM viewer WHERE viewer = ?)',[email], async (err, rows, fields) => {
            
            if (err) {
              // if there is an error with the query, log the error
              logger.error("Problem getting requirements: \n", err);
              res.status(400).send('Problem getting requirements:'); 
            } else {
              members = JSON.parse(JSON.stringify(rows));
              console.log('members: ', members);
              missing = get_bad_users(members,email, connection);
              
              connection.query('SELECT * FROM user WHERE 0 = 1', (err, rows, fields) => {
                if (err) {
                  // if there is an error with the query, log the error
                  logger.error("Problem getting requirements: \n", err);
                  res.status(400).send('Problem getting requirements:');
                } else {
                  res.status(200).json({
                    "data":missing,
                    "percentage":(missing.length/members.length)*100
                  });
                }
              });

             
              
              
              // connection.release();
              console.log('jdlksf\n');
              
          }

      
             
              
              
            
        });
        }

      });
      
    }else{
      res.status(400).send('Not an admin');
    }


  });
//get all workers/students in organization
router.get('/admin/members', authenticateJWT, (req, res) => {
  const token_info = jwt.decode(req.headers.authorization.split(' ')[1]);
  console.log("testing");
  if (token_info.admin){
    const email = token_info.email;
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT first_name, last_name, email, username FROM user WHERE username IN (SELECT record_holder from viewer WHERE viewer = ?);',[email], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem getting members: \n", err);
            res.status(400).send('Problem getting members:'); 
          } else {
            res.status(201).json({
                "data":rows
            });
          }
        });
      }
    });

  }else{
    res.status(400).send('Not an admin');
  }

});

//get all profiles a user can view
router.get('/:id/viewable', authenticateJWT, (req, res) => {
  const token_info = jwt.decode(req.headers.authorization.split(' ')[1]);
  
  const id = req.params.id;
  const view_user  = req.query.view;
  const email = token_info.email;
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        if (!view_user){
        console.log('no specific user');
        connection.query('SELECT first_name, last_name, email, username FROM user WHERE username IN (SELECT record_holder FROM viewer WHERE viewer = ?)',[email], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem getting members: \n", err);
            res.status(400).send('Problem getting members:'); 
          } else {
            res.status(201).json({
                "data":rows
            });
          }
        });
      }
      else{
        
        connection.query('SELECT manufacturer, name, date FROM vaccine_user WHERE username = ? AND (SELECT CASE WHEN EXISTS (SELECT viewer FROM viewer WHERE record_holder = ? and viewer = ?) THEN TRUE ELSE FALSE END) = TRUE', [view_user, view_user, email], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem getting members: \n", err);
            res.status(400).send('Problem getting members:'); 
          } else {
            res.status(201).json({
                "data":rows
            });
          }
        }
      );
       
      }
      }
    });
  });
  



 module.exports = router;

 