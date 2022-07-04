const express = require('express');
const router = express.Router();
const dbWorker = require('../logic/dbWorker');
const {sqlErrHandler} = require('../logic/errHandler');
const logger = require('../logic/logger')(module);


router.post('/:tableName/delete/:id', async (req, res) => {
    dbWorker.DeleteElement(req.params.tableName, req.params.id, function(err, data){         
        if(err)
        {
            logger.debug('Delete element error', {err:err, primary:req.params.id})
            sqlErrHandler(err, res);
            return;
        }
        res.redirect('/'+req.params.tableName);
    });
});


module.exports = router;