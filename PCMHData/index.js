var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var resultdata={};
var rowdata = [];

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var config = {  
        server: 'dcmservername.database.windows.net',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'dcmadmin', //update me
                password: 'dcm@1234'  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            encrypt: true,
            database: 'dcmdatabase'  //update me
        }
    };  

    var connection = new Connection(config);

    connection.on('connect', function(err) {

        if (err) {
            context.log(err);

            context.res = {
                status: 500,
                body: "Unable to establish a connection."
            };
            context.done();

        } else {
            
            var pcmhid = req.body.pcmhid
            
           // var pcmhid = req.body.pcmhid

            if(pcmhid=="-1")
            {
                executeStatement();
            }

            else
            {
                GetPCMHByID(pcmhid);
               
            }

           
        }
    });

    function executeStatement() {
        var isactive=1;
        request = new Request("select * FROM pcmh_tbl where isactive = '" + isactive + "' ORDER BY pcmhid DESC", function(err, rowCount) {
       // request = new Request("select * FROM pcmh_tbl", function(err, rowCount) {
          
        if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement1."
                };
                context.done();

            } else {
                context.log(rowCount + ' rows');
            }
        });
        rowdata=[];
        request.on('row', function(columns) {
            var rowObject = {};
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject[column.metadata.colName] = column.value;
               
                }
               
              
            });
            rowdata.push(rowObject);

        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {
            context.res = {
                        body: rowdata
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }

    function GetPCMHByID(pcmhid) {
       
        request = new Request("select * FROM pcmh_tbl WHERE pcmhid = '" + pcmhid + "' ORDER BY pcmhid DESC" , function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement2."
                };
                context.done();

            } else {
                context.log(rowCount + ' rows');
            }
        });

        request.on('row', function(columns) {
            columns.forEach(function(column) {
               
                //context.log(column.value);
                resultdata[column.metadata.colName] = column.value;
               // resultdata.push(column.value)
               
              
            });
            
            //context.log(resultdata);
            context.res = {
                body: resultdata
            };
            
            context.done();
        });

        connection.execSql(request);
    }
};