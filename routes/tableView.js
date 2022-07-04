const express = require('express');
const router = express.Router();
const commonParams = require('../logic/commonParams');
const dbWorker = require('../logic/dbWorker');
const {sqlErrHandler} = require('../logic/errHandler');
const logger = require('../logic/logger')(module);

router.get('/:tableName', async (req, res) => {        
    // Maping obj
    var filters=commonParams.MyMap([req.query])[0];
    var currentPage=0;
    filters.forEach(el => {
        if(el[0]=='p')
        {
            
            var tmp = parseInt(el[1])        
            if(tmp&&!isNaN(tmp))
            {
                currentPage = tmp;
            }
        }
    });    

    dbWorker.SelectTableContent(req.params.tableName, filters, function(err, data){         
        if(err)
        {
            
            logger.debug('Get table error', {err:err});
            sqlErrHandler(err, res);
            return;
        }
        var rowsCount = data[1][0].COUNT;        
        //Sending result
        var result = commonParams.MyMap(data[0]);
        res.render("tableView.ejs", {
            filters:filters,
            schema:dbWorker.schema.get(req.params.tableName), 
            result:result, 
            table:req.params.tableName, 
            idColumn:dbWorker.GetPrimaryColumnName(req.params.tableName),
            currentPage:currentPage,
            pagesCount:parseInt(rowsCount/commonParams.pageSize)
        });
    });    
});


module.exports=router;