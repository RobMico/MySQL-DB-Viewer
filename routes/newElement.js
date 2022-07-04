const express = require('express');
const router = express.Router();
const commonParams = require('../logic/commonParams');
const dbWorker = require('../logic/dbWorker');
const {sqlErrHandler} = require('../logic/errHandler');
const logger = require('../logic/logger')(module);

router.post('/:tableName/new/', async (req, res) => {
    var atr = Object.keys(req.body).map((key) => [key, req.body[key]]);
    dbWorker.Insert(req.params.tableName, atr, function(err, data){
        if(err)
        {
            logger.debug('New element post error', {err:err})
            sqlErrHandler(err, res);
            return;
        }
        res.redirect('/'+req.params.tableName);
    });    
});
router.get('/:tableName/new/', async (req, res) => {
    if(!dbWorker.schema.get(req.params.tableName)){res.send('No such table'); return;}
    res.render("editForms/tableViewEdit.ejs", {result:null, table:req.params.tableName, schema:dbWorker.schema.get(req.params.tableName)});
});

module.exports=router;
