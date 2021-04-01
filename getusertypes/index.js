var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var resultdata=[];
// var rowdata = {};
var jsonArray = [];

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
            database: 'dcmdatabase' , //update me
            rowCollectionOnRequestCompletion:true
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
            
            // var pcmhid = req.body.pcmhid

            
                Getusertype();
               
           
        }
    });

   

    function Getusertype() {
       
        request = new Request("select * FROM usertype_tbl WHERE issuperadmin !=1" , function(err, rowCount,rows) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement2."
                };
                context.done();

            } else {
                context.log(rowCount + ' rows' +' rows=== '+rows);

            }
        });
        //reset the jsonArray
        jsonArray = [];
        request.on('row', function (columns) {
            var rowObject = {};
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
    
                    rowObject[column.metadata.colName] = column.value;
                }
            });
    
            jsonArray.push(rowObject);
    
        });
    
        request.on('doneProc', function (rowCount, more, returnStatus, rows) {
            //console.log(rowCount + ' rows returned');
            // console.log(rows) // this is the full array of row objects
            context.res = {
                        body: jsonArray
                    };
                    
                    context.done();
        });



        connection.execSql(request);
    }
};