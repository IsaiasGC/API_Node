const express = require('express');
const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const ensure = require('./authorization/ensure');

const router = express.Router();
const pool = new Pool({
    user: "moviles",
    host: "localhost",
    database: "classroom",
    password: "moviles",
    port: 5432
});

router.get('/', ensure.authorized, async (req, res)=>{
    var val = 0
    await pool.query("select * from tbluser;", (error, results) => {
        if(error)
            res.status(404).json({
            status: 'not founded',
            valid: val
            });
        else{
            val=1;
            data={
              data: results.rows,
              status: 'founded',
              valid: val,
            }
            res.status(200).json(data);
        }
    });
});
router.get('/:id', ensure.authorized, async (req, res)=>{
    const id=parseInt(req.params.id);
    var val = 0
    await pool.query("select * from tbluser where id=$1;", [id], (error, results) => {
        if(error){
            res.status(404).json({
            status: 'not founded',
            valid: val
            });
        }else{
            val=1;
            if(results.rows[0]){
                data={
                    data: results.rows,
                    status: 'founded',
                    valid: val
                }
            }else{
                data = {
                    status: 'not founded',
                    valid: val
                }
            }
        }
        res.status(200).json(data);
    });
});
router.post('/login', async (req, res)=>{
    const { email, password } = req.body;
    var val = 0
    await pool.query("select * from tbluser where email=$1 and password=$2;", [email, password], (error, results) => {
      if(error){
        res.status(404).json({
          status: 'not founded',
          valid: val
        });
      }else{
        val=1;
        if(results.rows[0]){
          data = {
            data: {
              nombre: results.rows[0].name,
              correo: results.rows[0].email,
              token: results.rows[0].token
            },
            status: 'authenticated',
            valid: val
          }
        }else{
          data = {
            status: 'not authenticated',
            valid: val
          }
        }
        res.status(200).json(data);
      }
    });
  });
  router.post('/', async (req, res)=>{
    const { name, lastname, birtdate, email, password, type } = req.body;
    const token=jwt.sign({'email':email, 'type':type}, "El Classroom de Moviles.");
    var val = 0
    await pool.query("insert into tbluser(name, lastname, birtdate, email, password, idtype_id, token) values($1, $2, $3, $4, $5, $6);",
    [name, lastname, birtdate, email, password, type], (error, results) => {
      if(error){
        res.status(400).json({
          status: 'not inserted',
          valid: val
        });
      }else{
        val=1;
        res.status(201).json({
          status: 'inserted',
          valid: val
        });
      }
    });
  });
  router.put('/:id', ensure.authorized, async (req, res)=>{
    const id=parseInt(req.params.id);
    const { name, lastname, birtdate, email, password } = req.body;
    await pool.query("update tbluser set name=$1, lastname=$2, birtdate=$3, email=$4, password=$5 where id=$6;",
    [name, lastname, birtdate, email, password, id], (error, results) => {
      if(error){
        res.status(400).json({
          status: 'not updated',
          valid: val
        });
      }else{
        val=1;
        res.status(200).json({
          status: 'updated',
          valid: val
        });
      }
    });
  });
  router.delete('/:id', ensure.authorized, async (req, res)=>{
    const id=parseInt(req.params.id);
    await pool.query("delete from tbluser where id=$1;",
    [id], (error, results) => {
      if(error){
        res.status(400).json({
          status: 'not deleted',
          valid: val
        });
      }else{
        val=1;
        res.status(200).json({
          status: 'deleted',
          valid: val
        });
      }
    });
  });
  

  module.exports = router;