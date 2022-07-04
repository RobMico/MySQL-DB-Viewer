const express = require('express');
const config = require('config');

const router = express.Router();
const dbWorker = require('../logic/dbWorker');
const {sqlErrHandler} = require('../logic/errHandler');
const logger = require('../logic/logger')(module);

router.get('/', async (req, res) => {    
    res.render("index.ejs", {});
});

router.post('/', async (req, res) => {
        
    res.send("TODO");
    
});
module.exports = router;