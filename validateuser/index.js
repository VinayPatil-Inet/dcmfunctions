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
            
            var username = req.body.username;
            var password = req.body.password;
            
            validateuser(username,password);
             
        }
    });

   
    function validateuser(username,password) {
       
        request = new Request("select user_tbl.*,usertype_tbl.usertype FROM user_tbl LEFT JOIN usertype_tbl ON user_tbl.usertypeid=usertype_tbl.usertypeid WHERE username = '" + username + "' and password = '" + password + "'" , function(err, rowCount) {
            if (err) {
                // context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement2."
                };
                context.done();

            } else {
                // context.log(rowCount + ' rows');
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