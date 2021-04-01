var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var result = "helloooo.... "; 
    var config = {  
        server: 'dcmappserver.database.windows.net',  //update me
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
        // If no error, then good to proceed.  
        // console.log("Connected");  
        executeStatement1();  
    });  
  
      
    function executeStatement1() {  
        request = new Request("SELECT * FROM pcmh_tbl;", function(err) {  
        if (err) {  
            context.res = {
                body: err
            };
            result="errrrr.... ";
        }  
        });  
         
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                context.res = {
                    body: 'null'
                };  
                result+= "nullllllll.. "; 
              } else {  
                // result+= column.value + " ";  
                result+= "testingggggg.. ";  
              }  

            });  
            context.res = {
                body: result
            };  
           // result ="";  
        });  
  
        request.on('done', function(rowCount, more) {  
            
        //console.log(rowCount + ' rows returned');  
            context.res = {
                body: rowCount
            };  
            //result+=rowCount;
            result+="rowCount.... ";
           //  context.done();
        });  
        connection.execSql(request);  
    } 
    context.res = {
        body: "its sucess in responce "+JSON.stringify(result)
    };
}