const express = require('express');
const commonParams=require('../logic/commonParams');
const router = express.Router();
const {sqlErrHandler} = require('../logic/errHandler');

router.post('/finalaccountiong/report', async (req, res) => {
    var query ='CALL SUMMARIZE_QUARTER();';
    commonParams.pool.query(query, function(err, data){ 
        if(err)
        {
            sqlErrHandler(err, res);
            return;
        }
        res.redirect('/finalaccountiong')
    });
});
router.post('/finalaccountiong/edit/', async (req, res) => {
    req.params.tableName='finalaccountiong';
    var atr = Object.keys(req.body).map((key) => [key, req.body[key]]);
    if(req.body[commonParams.GetPrimaryColumnName(req.params.tableName)])//update existing element
    {
        var query='UPDATE '+req.params.tableName+' SET';
        var params=[];
        var idvalue;
        var first=true;
        atr.forEach(el=>{
            if(commonParams.GetPrimaryColumnName(req.params.tableName)!=el[0]){
                query+=(first?' ':', ')+el[0]+'=?';
                first=false;
                params.push(el[1]);
            }
            else{idvalue=el[1];}
        });
        query+=' WHERE '+commonParams.GetPrimaryColumnName(req.params.tableName)+'=?';
        params.push(idvalue);
        commonParams.pool.query(query,params, function(err, data){
            if(err)
            {
                console.log(err);
                res.send('err');
                return;
            }
            res.redirect('/'+req.params.tableName);
        });
        
    }else//new element
    {
        res.send("finalaccountiong creating new elements forbidden");
    }
});
router.get('/finalaccountiong/edit/:id', async (req, res) => {
    req.params.tableName='finalaccountiong';
    const query='SELECT * FROM '+req.params.tableName+' WHERE '+commonParams.GetPrimaryColumnName(req.params.tableName)+'=?';    
    const params=[req.params.id];
    commonParams.pool.query(query,params, function(err, data){
        if(err)
        {
            res.send("err");
            console.log(err);
            return;
        }
        result = commonParams.MyMap(data);        
        result[0].forEach(el=>{
            if(el[0]=='quarter_num'){
                el.push(true);
            }
            if(el[0]=='total_income'){
                el.push(true);
            }
            if(el[0]=='total_expenditure'){
                el.push(true);
            }
            if(el[0]=='total'){
                el.push(true);
            }
            if(el[0]=='date'){
                el.push(true);
            }
        })
        res.render("editForms/tableViewEdit.ejs", {result:result[0], table:req.params.tableName,
            schema:commonParams.schema.get(req.params.tableName)});
    });    
});
router.get('/finalaccountiong', async (req, res) => {    
    req.params.tableName='finalaccountiong';

    var filters=commonParams.MyMap([req.query])[0];    
    var query ='SELECT * from '+req.params.tableName;
    var params=[];
    var first=true;
    filters.forEach(el=>{
        if(el[1]&&el[1]!='')
        {
            query+=(first?' WHERE ':' AND ')+el[0]+' LIKE ?';
            params.push('%'+el[1]+'%');
            
            first=false;
        }
    });    
    commonParams.pool.query(query, params, function(err, data){ 
        if(err)
        {
            console.log(err);
            res.send("err");
            return;
        }        
        var result = commonParams.MyMap(data);
        res.render("tableView.ejs", {
            filters:filters,
            schema:commonParams.schema.get(req.params.tableName), 
            result:result, 
            table:req.params.tableName, 
            idColumn:commonParams.GetPrimaryColumnName(req.params.tableName),
            topPanel:[{name:'Make finance report', url:'/finalaccountiong/report', method:'POST'}]
        });
    });
});



router.post('/expenditures/edit/', async (req, res) => {
    req.params.tableName='expenditures';
    var atr = Object.keys(req.body).map((key) => [key, req.body[key]]);
    if(req.body[commonParams.GetPrimaryColumnName(req.params.tableName)])//update existing element
    {
        var query='UPDATE '+req.params.tableName+' SET';
        var params=[];
        var idvalue;
        var first=true;
        atr.forEach(el=>{
            if(commonParams.GetPrimaryColumnName(req.params.tableName)!=el[0]){
                
                query+=(first?' ':', ')+el[0]+'=?';
                first=false;
                params.push(el[1]);
            }
            else{idvalue=el[1];}
        });
        query+=' WHERE '+commonParams.GetPrimaryColumnName(req.params.tableName)+'=?';
        params.push(idvalue);
        pool.query(query,params, function(err, data){
            if(err)
            {
                console.log(err);
                res.send('err');
                return;
            }
            res.redirect('/'+req.params.tableName);
        });
        
    }else//new element
    {
        var query='INSERT INTO '+req.params.tableName+' (';
        var params=[];
        var qending=') VALUES(';
        var first=true;
        atr.forEach(el=>{            
            query+=(first?'':', ') +el[0];
            if(el[0]=='quarter_num')
            {
                qending+=(first?'':', ')+'(SELECT MAX(quarter_num) FROM finalaccountiong)'
                first=false;
            }
            else{                
                params.push(el[1]);
                qending+=(first?'':', ')+'?';
                first=false;
            }
        });
        query=query+qending+');'        
        pool.query(query,params, function(err, data){
            if(err)
            {
                console.log(err);
                res.send('err');
                return;
            }
            res.redirect('/'+req.params.tableName);
        });
    }
});
router.get('/expenditures/edit/:id', async (req, res) => {
    req.params.tableName='expenditures';
    const query='SELECT * FROM '+req.params.tableName+' WHERE '+commonParams.GetPrimaryColumnName(req.params.tableName)+'=?';    
    const params=[req.params.id];
    commonParams.pool.query(query,params, function(err, data){
        if(err)
        {
            res.send("err");
            console.log(err);
            return;
        }
        result =  commonParams.MyMap(data);        
        result[0].forEach(el=>{
            if(el[0]=='quarter_num'){
                el.push(true);
            }            
        })
        res.render("editForms/tableViewEdit.ejs", {result:result[0], table:req.params.tableName,
            schema:commonParams.schema.get(req.params.tableName)});
    });    
});
router.post('/expenditures/new/', async (req, res) => {
    req.params.tableName='expenditures';
    var atr = Object.keys(req.body).map((key) => [key, req.body[key]]);
    var query='INSERT INTO '+req.params.tableName+' (';
        var params=[];
        var qending=') VALUES(';
        var first=true;
        atr.forEach(el=>{            
            query+=(first?'':', ') +el[0];
            if(el[0]=='quarter_num')
            {
                qending+=(first?'':', ')+'(SELECT MAX(quarter_num) FROM finalaccountiong)'
                first=false;
            }
            else{                
                params.push(el[1]);
                qending+=(first?'':', ')+'?';
                first=false;
            }
        });
        query=query+qending+');'        
        commonParams.pool.query(query,params, function(err, data){
            if(err)
            {
                console.log(err);
                res.send('err');
                return;
            }
            res.redirect('/'+req.params.tableName);
        });
});

router.post('/incomes/edit/', async (req, res) => {
    req.params.tableName='incomes';
    var atr = Object.keys(req.body).map((key) => [key, req.body[key]]);
    if(req.body[commonParams.GetPrimaryColumnName(req.params.tableName)])//update existing element
    {
        var query='UPDATE '+req.params.tableName+' SET';
        var params=[];
        var idvalue;
        var first=true;
        atr.forEach(el=>{
            if(commonParams.GetPrimaryColumnName(req.params.tableName)!=el[0]){
                query+=(first?' ':', ')+el[0]+'=?';
                first=false;
                params.push(el[1]);
            }
            else{idvalue=el[1];}
        });
        query+=' WHERE '+commonParams.GetPrimaryColumnName(req.params.tableName)+'=?';
        params.push(idvalue);
        commonParams.pool.query(query,params, function(err, data){
            if(err)
            {
                console.log(err);
                res.send('err');
                return;
            }
            res.redirect('/'+req.params.tableName);
        });
        
    }else//new element
    {
        var query='INSERT INTO '+req.params.tableName+' (';
        var params=[];
        var qending=') VALUES(';
        var first=true;
        atr.forEach(el=>{            
            query+=(first?'':', ') +el[0];
            if(el[0]=='quarter_num')
            {
                qending+=(first?'':', ')+'(SELECT MAX(quarter_num) FROM finalaccountiong)'
                first=false;
            }
            else{                
                params.push(el[1]);
                qending+=(first?'':', ')+'?';
                first=false;
            }
        });
        query=query+qending+');'        
        commonParams.pool.query(query,params, function(err, data){
            if(err)
            {
                console.log(err);
                res.send('err');
                return;
            }
            res.redirect('/'+req.params.tableName);
        });
    }
});
router.get('/incomes/edit/:id', async (req, res) => {
    req.params.tableName='incomes';
    const query='SELECT * FROM '+req.params.tableName+' WHERE '+commonParams.GetPrimaryColumnName(req.params.tableName)+'=?';    
    const params=[req.params.id];
    commonParams.pool.query(query,params, function(err, data){
        if(err)
        {
            res.send("err");
            console.log(err);
            return;
        }
        result = commonParams.MyMap(data);        
        result[0].forEach(el=>{
            if(el[0]=='quarter_num'){
                el.push(true);
            }            
        })
        res.render("editForms/tableViewEdit.ejs", {result:result[0], table:req.params.tableName,
            schema:commonParams.schema.get(req.params.tableName)});
    });    
});

router.post('/incomes/new/', async (req, res) => {
    req.params.tableName='incomes';
    var atr = Object.keys(req.body).map((key) => [key, req.body[key]]);
    var query='INSERT INTO '+req.params.tableName+' (';
        var params=[];
        var qending=') VALUES(';
        var first=true;
        atr.forEach(el=>{            
            query+=(first?'':', ') +el[0];
            if(el[0]=='quarter_num')
            {
                qending+=(first?'':', ')+'(SELECT MAX(quarter_num) FROM finalaccountiong)'
                first=false;
            }
            else{                
                params.push(el[1]);
                qending+=(first?'':', ')+'?';
                first=false;
            }
        });
        query=query+qending+');'        
        commonParams.pool.query(query,params, function(err, data){
            if(err)
            {
                console.log(err);
                res.send('err');
                return;
            }
            res.redirect('/'+req.params.tableName);
        });
});



module.exports = router;