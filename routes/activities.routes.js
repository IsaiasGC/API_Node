const express = require('express');
const Pool = require("pg").Pool;
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
    await pool.query("select * from tblactivities;", (error, results) => {
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
            valid: val
            }
            res.status(200).json(data);
        }
    });
});
router.get('/:id', ensure.authorized, async (req, res)=>{
    const id=parseInt(req.params.id);
    var val = 0
    await pool.query("select * from tblactivities where id=$1;", [id], (error, results) => {
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
  router.post('/', ensure.authorized, async (req, res)=>{
    const { activity, description, datactivity, idcourse_id } = req.body;
    var val = 0
    await pool.query("insert into tblactivities(activity, description, datactivity, idcourse_id) values($1, $2, $3, $4);",
    [activity, description, datactivity, idcourse_id], (error, results) => {
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
    const { activity, description, datactivity, idcourse_id } = req.body;
    await pool.query("update tblactivities set activity=$1, description=$2, datactivity=$3, idcourse_id=$4 where id=$5;",
    [activity, description, datactivity, idcourse_id, id], (error, results) => {
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
    await pool.query("delete from tblactivities where id=$1;",
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