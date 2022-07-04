const express = require('express');
const router = express.Router();
const dbWorker = require('../logic/dbWorker');


router.post('/updateschema', (req, res)=>{        
    dbWorker.GetSchema();
    res.redirect("/");
});



module.exports = router;