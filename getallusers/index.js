
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
            
                Getuserdetails();
        }
    });

   

    function Getuserdetails() {

        // var user_input = req.originalUrl;
        // var url = new URL(user_input);
        // var draw = url.searchParams.get("draw");
        // req.query
            // var start = user_input.start //contains Mickey
            // lastn = user_input.lastname    //contains Mouse
        // var start= req.query.start;
        var url = new URL(req.originalUrl);
        var searchParams = new URLSearchParams(url.search);
        var start = searchParams.get('start');
        var draw = searchParams.get('draw');

        var length = searchParams.get('length');
        var search = searchParams.get('search[value]');

        if(search!="")
        {
            //var search_q = "WHERE pcmhname LIKE % "+search+" OR pcmh_dgn_username LIKE % "+search+ "OR firstname LIKE % "+search+" OR lastname LIKE % "+search;
            var search_q = "and (user_tbl.username LIKE '%"+search+"%' OR user_tbl.firstname LIKE '%"+search+"%' OR user_tbl.lastname LIKE '%"+search+"%' OR pcmh_tbl.pcmhname LIKE '%"+search+"%')";
        }
        else
        {
            var search_q="";
        }

       
        request = new Request("select user_tbl.*,(select count(*) from user_tbl where usertype_tbl.usertypeid!=1 "+search_q+") as totalrec,pcmh_tbl.pcmhname,usertype_tbl.usertype FROM user_tbl LEFT JOIN pcmh_tbl ON pcmh_tbl.pcmhid=user_tbl.pcmhid LEFT JOIN usertype_tbl ON usertype_tbl.usertypeid=user_tbl.usertypeid where usertype_tbl.usertypeid!=1 "+search_q+" order by userid DESC OFFSET "+start+" ROWS FETCH NEXT 10 ROWS ONLY" , function(err, rowCount,rows) {
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
                // if (column.value === null) {
                //     console.log('NULL');
                // } else {
    
                    rowObject[column.metadata.colName] = column.value;
                // }
            });
    
            jsonArray.push(rowObject);
    
        });
    
        request.on('doneProc', function (rowCount, more, returnStatus, rows) {
            //console.log(rowCount + ' rows returned');
            // console.log(rows) // this is the full array of row objects
           
       
            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": jsonArray[0].totalrec,
                "recordsTotal": jsonArray[0].totalrec,
                "data": jsonArray
                });

            context.res = {
                        body: data
                    };
                    
                    context.done();
        });



        connection.execSql(request);
    }
};
