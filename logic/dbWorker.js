const commonParams = require('./commonParams');
const config = require('config');
const mysql = require("mysql2");
const logger = require('./logger')(module);


var myObj={};

myObj.schema=new Map();
myObj._tables= 'null';
myObj.pageSize=100;


myObj.GetSchema = (callback)=>{
    logger.info('Get/Update schema');
    myObj.schema=new Map();
    myObj._tables='s';
    var query2="SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME  FROM information_schema.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA='Museum' AND TABLE_SCHEMA='Museum';";
    var query="select TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_KEY from information_schema.columns where table_schema = 'Museum' order by table_name,ordinal_position;"
        myObj.pool.query(query, function(err, data){ 
            if(err)
            {                
                logger.error('SChema update failed', err);
                return;
            }
            myObj.pool.query(query2, function(err2, data2){
                if(err2)
                {
                    logger.error('SChema update failed', err);
                    return;
                }
                data.forEach(element => {                
                    if(!myObj.schema.get(element.TABLE_NAME))           
                    {

                        myObj.schema.set(element.TABLE_NAME, []);
                    }
                    myObj.schema.get(element.TABLE_NAME).push([element.COLUMN_NAME, element.DATA_TYPE, element.COLUMN_KEY]);                
                    myObj._tables =[ ...myObj.schema.keys() ];
                });
                //TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_SCHEMA, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                data2.forEach(element=>{
                    myObj.schema.get(element.TABLE_NAME).forEach(item=>{
                        if(item[0]==element.COLUMN_NAME){                            
                            item.push(element.REFERENCED_TABLE_NAME);
                            item.push(element.REFERENCED_COLUMN_NAME);
                        }
                    })
                });   
                if(callback)
                {
                    callback();
                }             
            });            
        });
}

myObj.CheckTable=(TName)=>{
    logger.info('Check table');
    return typeof myObj.schema.get(TName)!="undefined";
}

//Return type of column or false if not exists
myObj.CheckColumn=(TName, CName)=>{
    
    var table = myObj.schema.get(TName)
    var res=false;

    if(typeof table!="undefined")
    {
        table.forEach(el=>{            
            if(el[0]==CName)
            {
                res=el[1];
            }
        });
        
    }
    logger.info('Check column', {"return":res});
    return res;
}
//Get name of primary attribute
myObj.GetPrimaryColumnName = (table)=>{
    logger.info('GetPrimaryColumnName started');
    var tmp = myObj.schema.get(table);
    for(i=0; i<tmp.length;i++)
    {
        if(tmp[i][2]=='PRI'){
            logger.info('GetPrimaryColumnName return', {"return":tmp[i][0]});
            return tmp[i][0]
        }
    }
        
}

myObj.DBConnect = (connParams, callback)=>{
    
    myObj.pool = mysql.createPool(
        {
            host:connParams.host,
            user:connParams.user,
            database:connParams.database,
            password:connParams.password,
            connectionLimit:5,
            multipleStatements: true
        }
    );    
    myObj.pool.query('SELECT 1', (err, data)=>{
        if(err)
        {
            callback(err);
            logger.debug("Connection failed", connParams);
            pool = undefined;
            return;
        }
        else{
            logger.debug('Connecting to db, success', connParams);
            myObj.GetSchema(callback);
            
        }
    });
    
}

myObj.CheckConnection = ()=>{
    if(myObj.pool)
    {
        return true;
    }
    return false;
}



myObj.SelectTableContent = (table, filters, callback)=>{
    logger.info('SelectTableContent');
    if(!myObj.schema.get(table)){
        callback({
            Message:'No such table',
            errno:-1,
            table:table         
        });
        logger.debug('SelectTableContent:table not exist', {table:table});
        return;
    }

    //Creating query
    var query ='SELECT SQL_CALC_FOUND_ROWS * FROM '+table;
    var limits='';
    var order='';
    var params=[];
    var first=true;


    filters.forEach(el=>{
        if(el[1]&&el[1]!=''){
            if(el[0].includes('!'))
            {
                var arg = el[0].split('!');
                var type = myObj.CheckColumn(table, arg[1]);
                if(type){
                    if(type=='int' || type=='decimal')
                    {
                        if(arg[0]=='')
                        {   
                            query+=(first?' WHERE ':' AND ')+arg[1]+' = ?';
                            params.push(el[1]);
                            first=false;
                        }
                        if(arg[0]=='MAX')
                        {
                            query+=(first?' WHERE ':' AND ')+arg[1]+' <= ?';
                            params.push(el[1]);
                            first=false;
                        }
                        if(arg[0]=='MIN')
                        {
                            query+=(first?' WHERE ':' AND ')+arg[1]+' >= ?';
                            params.push(el[1]);
                            first=false;
                        }
                    }else if(type=='text'||type=='varchar')
                    {
                        
                        query+=(first?' WHERE ':' AND ')+arg[1]+' LIKE ?';
                        params.push('%'+el[1]+'%');
                        first=false;
                    }
                }
            }else{
                if(el[0]=='p'&&el[1]&&el[1]!=''&&!isNaN(parseInt(el[1])))
                {                    
                    limits=' LIMIT '+(parseInt(el[1])*commonParams.pageSize).toString()+', '+(commonParams.pageSize).toString();
                }
                if(el[0]=='orderby'&&el[1]&&el[1]!=''&&myObj.CheckColumn(table, el[1]))
                {                    
                    order = ' ORDER BY '+el[1];                    
                }
                if(el[0]=='orderdesc'&&el[1]&&el[1]!='')
                {
                    if(order!=''&& el[1]=='true')
                    {
                        order+=' DESC';               
                    }
                }
            }
        }
    });
    query+=order + (limits==''?(' LIMIT '+commonParams.pageSize.toString()):limits)+";SELECT FOUND_ROWS() AS COUNT;";
    logger.info('SelectTableContent:query', {query:query});
    myObj.pool.query(query, params, callback);
}

myObj.rawSql = (sql, callback)=>{
    logger.debug('Raw sql', {query:sql});
    myObj.pool.query(sql, callback);
};


myObj.Insert = (table, atr, callback)=>{    
    if(!myObj.schema.get(table)){
        callback({
            Message:'No such table',
            errno:-1,
            table:table         
        });
        return;
    }
    var query='INSERT INTO '+table+' (';
    var params=[];
    var qending=') VALUES(';
    var first=true;
    var tmp;
    atr.forEach(el=>{
        type = myObj.CheckColumn(table, el[0])        
        if(type)
        {
            query+=(first?'':', ') +el[0];           
            params.push(el[1]);
            qending+=(first?'':', ')+'?';            
            first=false;
        }
    });
    query=query+qending+');';
    logger.debug("Insert:query", {query:query});
    myObj.pool.query(query, params, callback);
}

myObj.GetElementByPrimary = (table, primary, callback)=>{
    if(!myObj.schema.get(table)){
        callback({
            Message:'No such table',
            errno:-1,
            table:table         
        });
        return;
    }
    //Creating query
    const query='SELECT * FROM '+table+' WHERE '+myObj.GetPrimaryColumnName(table)+'=?';    
    const params=[primary];
    logger.debug("GetElementByPrimary:query", {query:query, primary:primary});
    myObj.pool.query(query, params, callback);
}

myObj.UpdateElement = (table, atr, primary, callback)=>{
    if(!myObj.schema.get(table)){
        callback({
            Message:'No such table',
            errno:-1,
            table:table         
        });
        return;
    }

    var query='UPDATE '+table+' SET';
    var params=[];

    var first=true;
    atr.forEach(el=>{               
        query+=(first?' ':', ')+el[0]+'=?';
        first=false;
        params.push(el[1]);                
    });
    query+=' WHERE '+myObj.GetPrimaryColumnName(table)+'=?';
    params.push(primary);
    logger.debug("UpdateElement:query", {query:query, primary:primary});
    //Executing query
    myObj.pool.query(query,params, callback);
}

myObj.DeleteElement = (table, primary, callback)=>{
    if(!myObj.schema.get(table)){
        callback({
            Message:'No such table',
            errno:-1,
            table:table         
        });
        return;
    }
    var query='DELETE FROM '+table+' WHERE '+myObj.GetPrimaryColumnName(table)+'=?;';
    var params = [primary];    
    logger.debug("UpdateElement:query", {query:query, primary:primary});
    myObj.pool.query(query, params, callback);
}



module.exports = myObj;