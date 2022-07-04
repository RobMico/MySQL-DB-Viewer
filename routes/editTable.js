const express = require('express');
const router = express.Router();
const commonParams = require('../logic/commonParams');
const dbWorker = require('../logic/dbWorker');
const {sqlErrHandler} = require('../logic/errHandler');
const logger = require('../logic/logger')(module);


router.post('/:tableName/edit/:primary', async (req, res) => {    
    
    var atr = Object.keys(req.body).map((key) => [key, req.body[key]]);        
    //Creating query
    dbWorker.UpdateElement(req.params.tableName, atr, req.params.primary ,function(err, data){
        if(err)
        {
            logger.debug('Update element post error', {err:err, primary:req.params.primary});
            sqlErrHandler(err, res);

            return;
        }
        res.redirect('/'+req.params.tableName);
    });
});

router.get('/:tableName/edit/:id', async (req, res) => {            


    dbWorker.GetElementByPrimary(req.params.tableName, req.params.id, function(err, data){
        if(err)
        {
            logger.debug('Update element get error', {err:err, primary:req.params.id});
            sqlErrHandler(err, res);
            return;
        }
        result = commonParams.MyMap(data);        
        
        res.render("editForms/tableViewEdit.ejs", {
            id:req.params.id,
            result:result[0],
            table:req.params.tableName,
            schema:dbWorker.schema.get(req.params.tableName)
        });
    });
    
});

module.exports = router;