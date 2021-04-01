const { getHeapCodeStatistics } = require('v8');

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;



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
            var isactive = req.body.isactive
            DeletePCMH(pcmhid,isactive);

           /* var pcmhid = req.body.pcmhid
            var isactive = req.body.isactive
            
            if(pcmhid!="")
            {
                DeletePCMH(pcmhid,isactive);
            }
            else
            {
                GetAllPCMH();
            }
            

           var start = req.body.start
           var length = req.body.length
           var draw = req.body.draw
           context.log("start = "+start);
           context.log("length = "+length);
           context.log("draw = "+draw);
           GetAllPCMH(start,length,draw);
           */
        }
    });
    
    function GetAllPCMH(start,length,draw) {
        request = new Request("select * FROM pcmh_tbl ORDER BY pcmhid DESC", function(err, rowCount) {
           
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
            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": rowdata[0].totalrec,
                "recordsTotal": rowdata[0].totalrec,
                "data": rowdata
                });

             context.res = {
                         body: data
                         
                     };
                     
                     context.done();
         });
 
         connection.execSql(request);
     }


    function DeletePCMH(pcmhid,isactive) {
       
        request = new Request("UPDATE pcmh_tbl SET isactive='"+isactive+"' where pcmhid='"+pcmhid+"'", function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement1."
                };
                context.done();

            } else {
                context.res = {
                    body: "ok"
                };
                context.done();
            }
        });

        connection.execSql(request);
    }
};