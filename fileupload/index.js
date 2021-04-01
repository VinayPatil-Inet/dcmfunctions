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
            
          GetAllPCMH();
           
        }
    });


    function GetAllPCMH() {

        var url = new URL(req.originalUrl);
        var searchParams = new URLSearchParams(url.search);
        var start = searchParams.get('start');
        var length = searchParams.get('length');
        var search = searchParams.get('search[value]');
        
        if(search!="")
        {
            //var search_q = "WHERE pcmhname LIKE % "+search+" OR pcmh_dgn_username LIKE % "+search+ "OR firstname LIKE % "+search+" OR lastname LIKE % "+search;
            var search_q = "WHERE pcmhname LIKE '%"+search+"%' OR pcmh_dgn_username LIKE '%"+search+"%' OR firstname LIKE '%"+search+"%' OR lastname LIKE '%"+search+"%'";
        }
        else
        {
            var search_q="";
        }
        
        var draw = searchParams.get('draw');

       request = new Request("select pcmh_tbl.*,(select count(*) from pcmh_tbl "+search_q+") as totalrec FROM pcmh_tbl "+search_q+" order by pcmhid DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY" , function(err, rowCount,rows) {
              
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

};