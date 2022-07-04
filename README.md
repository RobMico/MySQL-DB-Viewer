# MySQL-DB-Viewer
<h4>This is mysql db oserver</h4>
Database requirements<br/>
One unique key per table, numeric or text type<br />

<h4>Run:</h4>
```
git clone https://github.com/RobMico/MySQL-DB-Viewer.git<br />
cd MySQL-DB-Viewer<br />
npm i<br />
mkdir logs<br />
mkdir config<br />
cd config<br />
touch default.json<br />
nano default.json<br />
```
#Paste here somthing like this<br />
{<br />
    "port":3000,<br />
    "autoConnectDB":false,<br />
    "DB":{<br />
        "connectionLimit":,<br />
        "host":"",<br />
        "user":"",<br />
        "database":"",<br />
        "password":"",<br />
        "multipleStatements": true<br />
    }<br />
}<br />
````
cd ..<br />
node main.js
````
