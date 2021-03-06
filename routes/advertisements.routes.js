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
    await pool.query("select * from tbladvertisement;", (error, results) => {
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
    await pool.query("select * from tbladvertisement where id=$1;", [id], (error, results) => {
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
    const { notice, datadvertisement, idcourse_id } = req.body;
    var val = 0
    await pool.query("insert into tbladvertisement(notice, datadvertisement, idcourse_id) values($1, $2, $3);",
    [notice, datadvertisement, idcourse_id], (error, results) => {
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
    const { notice, datadvertisement, idcourse_id } = req.body;
    await pool.query("update tbladvertisement set notice=$1, datadvertisement=$2, idcourse_id=$3 where id=$4;",
    [notice, datadvertisement, idcourse_id, id], (error, results) => {
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
    await pool.query("delete from tbladvertisement where id=$1;",
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