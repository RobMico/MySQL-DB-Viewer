const logger = require('./logger')(module);
var myObj={};



myObj.pageSize=2;


//Map objects
myObj.MyMap=(obj)=>{   
    
    var res=[];
    obj.forEach(element => {

        res.push(Object.keys(element).map((key) => [key, (element[key] instanceof Date)?element[key].toISOString().split('T')[0]:element[key]]));
    });
    logger.info('Mapped obj', {size:res.length})
    return res;

}
module.exports = myObj;