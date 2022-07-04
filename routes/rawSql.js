const { query } = require('express');
const express = require('express');
const router = express.Router();
const dbWorker = require('../logic/dbWorker');
const commonParams = require('../logic/commonParams');
const logger = require('../logic/logger')(module);



router.get('/rawsql', (req, res)=>{        
    res.render('rawSql.ejs');
});
router.post('/rawsql', (req, res)=>{
    if(typeof req.body.sql =='string'){
    dbWorker.rawSql(req.body.sql, function(err, data){
        if(err)
        {
            logger.debug('Raw sql err', {err:err})
            res.json(err);
            return;
        }
        try{
            var MapedData=commonParams.MyMap(data);
        }catch{
            res.json(data);
            logger.debug('Raw sql send json');
            return;
        }
        logger.debug('Raw sql send page');
        res.render('rawSqlDisplay.ejs', {
            data:MapedData
        });
    });
    }else{res.send("invalid args");}
    
});



module.exports = router;