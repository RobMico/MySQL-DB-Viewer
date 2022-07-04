myObj={};

myObj.sqlErrHandler=(err, res)=>{
    if(err.errno==1366)
    {
        res.send("Incorrect arguments");
        return;
    }
    if(err.errno==-1)
    {
        res.send("No such table");
        return;
    }
    if(err.errno==1452)
    {
        res.send("Constrains error, check links");
        return;
    }
    if(err.errno==1451)
    {
        res.send("Constrains error, check links");
        return;
    }
    console.log(err);
    res.send("sql err code: "+err.errno);
}

myObj.serverErrorHandler=(err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
}

module.exports = myObj; 