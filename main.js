const config = require('config');
const PORT = config.get('port') || 3000;

const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mysql = require("mysql2");
const bodyParser = require('body-parser');

const dbWorker = require('./logic/dbWorker');
const {serverErrorHandler} = require('./logic/errHandler');

const logger = require('./logic/logger')(module);


//Geting pages
//const exceptedLinks=require('./routes/exceptedLinks');
const editTable=require('./routes/editTable');
const newElement = require('./routes/newElement');
const deleteElement = require('./routes/deleteElement');
const tableView = require('./routes/tableView');
const updateSchema = require('./routes/updateSchema');
const rawSql = require('./routes/rawSql');
const index = require('./routes/index');
const DBConnect = require('./routes/DBConnect');

//Create express app
const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//DB connect
if(config.get("autoConnectDB"))
{
  const pool = mysql.createPool(config.get("DB"));
  dbWorker.pool = pool;
  dbWorker.GetSchema();
  
}

//Instead of global variable
app.use(function (req, res, next) {
  
  if(!dbWorker.CheckConnection()&&req.url!='/connect')
  {
    logger.debug('Not connected, redirected to /connect')
    res.redirect('/connect');
    return;
  }
    res.locals = {
      tables: dbWorker._tables  
    };
    next();
});
//Set error handler to middleware
app.use(serverErrorHandler);


app.use(expressLayouts)
app.set('layout', './header.ejs')
//Connecting pages
app.use('/', DBConnect);
app.use('/', index);
app.use('/', updateSchema);
app.use('/', rawSql);
//app.use('/', exceptedLinks);
app.use('/table/', editTable);
app.use('/table', newElement);
app.use('/table/', deleteElement);
app.use('/table/', tableView);

app.listen(PORT, () => {
  logger.debug(`Example app listening on port ${PORT}`);
});