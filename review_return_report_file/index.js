var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
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
          
            executeStatement();
            
            
        }
    });

    function executeStatement() {

        var url = new URL(req.originalUrl);
        var searchParams = new URLSearchParams(url.search);
        var start = searchParams.get('start');
        var length = searchParams.get('length');
        var usertype = searchParams.get('usertype');
        var userid = searchParams.get('logged_in_userid');
        var pcmhid = searchParams.get('pcmhid');
        
        var draw = searchParams.get('draw'); 
         
 
        if(usertype=="Super Admin")
        {
            var pcmh = searchParams.get('pcmh');
            var month = searchParams.get('month');
            var year = searchParams.get('year');
            var search = searchParams.get('search[value]');
            if(search!="")
            {
                var search_q = "and (pcmhname LIKE '%"+search+"%' OR for_year LIKE '%"+search+"%' OR filename LIKE '%"+search+"%' OR monthname LIKE '%"+search+"%')";
            }
            else
            {
                var search_q="";
            }

            if(pcmh!="")
            {
            var pcmh_q = "and uploadedfiles_tbl.pcmh_id="+pcmh;
            }
            else
            {
                var pcmh_q = "";
            }

            if(month!="")
            {
            var month_q = "and uploadedfiles_tbl.for_month="+month;
            }
            else
            {
                var month_q = "";
            }

            if(year!="")
            {
            var year_q = "and uploadedfiles_tbl.for_year="+year;
            }
            else
            {
                var year_q = "";
            }
            
            //Superadmin
            var query ="select uploadedfileid,filename,for_month,for_year,userid,pcmh_id,pcmhname, monthname as month_name, (select count(*) from uploadedfiles_tbl WHERE isactive=1 "+pcmh_q+" "+month_q+" "+year_q+" "+search_q+") as totalrec FROM uploadedfiles_tbl INNER JOIN pcmh_tbl ON uploadedfiles_tbl.pcmh_id = pcmh_tbl.pcmhid WHERE isactive=1 "+pcmh_q+" "+month_q+" "+year_q+" "+search_q+"  ORDER BY uploadedfiles_tbl.uploadedfileid DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
        }
        else if(usertype=="Admin")
        {
            //bcbsri
            //var userid = req.body.logged_in_userid;
            var pcmh = searchParams.get('pcmh');
            var month = searchParams.get('month');
            var year = searchParams.get('year');

            var search = searchParams.get('search[value]');
            if(search!="")
            {
                var search_q = "and (pcmhname LIKE '%"+search+"%' OR for_year LIKE '%"+search+"%' OR filename LIKE '%"+search+"%' OR monthname LIKE '%"+search+"%')";
            }
            else
            {
                var search_q="";
            }

            

            if(pcmh!="")
            {
            var pcmh_q = "and uploadedfiles_tbl.pcmh_id="+pcmh;
            }
            else
            {
                var pcmh_q = "";
            }

            if(month!="")
            {
            var month_q = "and uploadedfiles_tbl.for_month="+month;
            }
            else
            {
                var month_q = "";
            }

            if(year!="")
            {
            var year_q = "and uploadedfiles_tbl.for_year="+year;
            }
            else
            {
                var year_q = "";
            }

            var query ="select uploadedfileid,filename,for_month,for_year,userid,pcmh_id,pcmhname,monthname as month_name, (select count(*) from uploadedfiles_tbl WHERE uploadedfiles_tbl.userid='"+userid+"' "+pcmh_q+" "+month_q+" "+year_q+" "+search_q+") as totalrec FROM uploadedfiles_tbl INNER JOIN pcmh_tbl ON uploadedfiles_tbl.pcmh_id = pcmh_tbl.pcmhid WHERE uploadedfiles_tbl.userid='"+userid+"' "+pcmh_q+" "+month_q+" "+year_q+" "+search_q+" ORDER BY uploadedfiles_tbl.uploadedfileid DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
        }
        else
        {
            //pcmh
            var month = searchParams.get('month');
            var year = searchParams.get('year');

            var search = searchParams.get('search[value]');
            if(search!="")
            {
                var search_q = "and (for_year LIKE '%"+search+"%' OR filename LIKE '%"+search+"%' OR monthname LIKE '%"+search+"%')";
            }
            else
            {
                var search_q="";
            }

            
           if(month!="")
            {
            var month_q = "and uploadedfiles_tbl.for_month="+month;
            }
            else
            {
                var month_q = "";
            }

            if(year!="")
            {
            var year_q = "and uploadedfiles_tbl.for_year="+year;
            }
            else
            {
                var year_q = "";
            }
            var query="select uploadedfileid,filename,for_month,for_year,userid,pcmh_id,monthname as month_name, (select count(*) from uploadedfiles_tbl WHERE pcmh_id='"+pcmhid+"' "+month_q+" "+year_q+" "+search_q+") as totalrec FROM uploadedfiles_tbl WHERE pcmh_id='"+pcmhid+"' "+month_q+" "+year_q+" "+search_q+" ORDER BY uploadedfiles_tbl.uploadedfileid DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";

        }

        request = new Request(query, function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement."
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
               
                    rowObject[column.metadata.colName] = column.value;
                }
             });
             rowdata.push(rowObject);
           
           
        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data1 = JSON.stringify({
                "draw": draw,
                "recordsFiltered": rowdata[0].totalrec,
                "recordsTotal": rowdata[0].totalrec,
                "data": rowdata
                });

            context.res = {
                        body: data1
                    };
                    
                    context.done();
        });
        
        connection.execSql(request);
    }

    function GetPCMH_Return_Report_File(pcmhid) {

        request = new Request("select uploadedfileid,filename,for_month,for_year,userid,pcmh_id,monthname as month_name FROM uploadedfiles_tbl WHERE pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement."
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
};