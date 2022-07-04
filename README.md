# MySQL-DB-Viewer
<h4>This is mysql db oserver</h4>
Database requirements<br/>
One unique key per table, numeric or text type<br />

<h4>Run:</h4>

```    
git clone https://github.com/RobMico/MySQL-DB-Viewer.git
cd MySQL-DB-Viewer
npm i
mkdir logs
mkdir config
cd config
touch default.json
nano default.json
```    

#Paste here somthing like this

```
{<br />
    "port":3000,
    "autoConnectDB":false,
    "DB":{
        "connectionLimit":,
        "host":"",
        "user":"",
        "database":"",
        "password":"",
        "multipleStatements": true
    }
}
```

Save file, and run application

```
cd ..
node main.js
```
