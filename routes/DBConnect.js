const express = require('express');
const config = require('config');

const router = express.Router();
const dbWorker = require('../logic/dbWorker');
const {sqlErrHandler} = require('../logic/errHandler');
const logger = require('../logic/logger')(module);


router.get('/connect', async (req, res) => {
    if(!dbWorker.CheckConnection())
    {
        res.render("DBConnect.ejs", {            
            params:config.get("DB")
        });
        return;
    }
    res.redirect('/')
});

router.post('/connect', async (req, res) => {
        
    dbWorker.DBConnect(req.body, (err)=>{
        if(err)
        {
            res.json(err);
            return;
        }
        res.redirect('/')
    });    
});

module.exports = router;