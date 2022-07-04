# MySQL-DB-Viewer
This is mysql db oserver
Database requirements
One unique key per table, numeric or text type



Run:
git clone https://github.com/RobMico/MySQL-DB-Viewer.git
cd MySQL-DB-Viewer
npm i
mkdir logs
mkdir config
cd config
touch default.json
nano default.json
#Paste here somthing like this
{
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
cd ..
node main.js