var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var resultdata=[];
var rowdata = {};

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
            
            var BCBSRI_ID = req.body.bcbsriid;
            // var returnreport_data_id = 2;

           
            GetPCMHByID(BCBSRI_ID);
               
           
        }
    });
    

      function GetPCMHByID(BCBSRI_ID) {
       
        request = new Request("select * FROM returnreport_data_tbl WHERE returnreport_data_id = '" + BCBSRI_ID + "'" , function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement2."
                };
                context.done();

            } else {
                context.res = {
                    status: 504,
                    body: rowCount
                };
                context.done();
            }
        });

        request.on('row', function(columns) {
            columns.forEach(function(column) {
               
                //context.log(column.value);
                rowdata[column.metadata.colName] = column.value;
               // resultdata.push(column.value)
               
              
            });
            resultdata.push(rowdata);
            //context.log(resultdata);
            context.res = {
                body: rowdata
            };
            
            context.done();
        });

        connection.execSql(request);
    }
};