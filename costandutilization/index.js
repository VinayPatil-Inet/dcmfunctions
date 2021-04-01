var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var costandutilizationdata = [];


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
            
            // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            
           
            var usertype = searchParams.get('usertype');
            var costandutilizationtype = searchParams.get('costandutilizationtype');
            
            
           costandutilization(usertype);
           
            
        }
    });


    function costandutilization(usertype) {

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
            // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');

            var costandutilization_month = searchParams.get('month');
            var costandutilization_year = searchParams.get('year');
            var costandutilization_risk = searchParams.get('risk');

            

            
           if(costandutilization_month!="")
            {
            var costandutilization_month_q = "and for_month="+costandutilization_month;
            }
            else
            {
                var costandutilization_month_q = "";
            }

            if(costandutilization_year!="")
            {
            var costandutilization_year_q = "and for_year="+costandutilization_year;
            }
            else
            {
                var costandutilization_year_q = "";
            }

            if(costandutilization_risk!="")
            {
                var costandutilization_risk_q = "and BCBSRI_Risk_Categorization='"+costandutilization_risk+"'"
            }
            else
            {
                var costandutilization_risk_q = "";
            }
            
            var costandutilization_search = searchParams.get('search[value]');

            if(costandutilization_search!="")
            {
                var costandutilization_search_q = "and (for_year LIKE '%"+costandutilization_search+"%' OR Mbr_Last_Name LIKE '%"+costandutilization_search+"%' OR Mbr_First_Name LIKE '%"+costandutilization_search+"%' OR BCBSRI_ID LIKE '%"+costandutilization_search+"%' OR BCBSRI_Risk_Categorization LIKE '%"+costandutilization_search+"%')";
            }
            else
            {
                var costandutilization_search_q="";
            }


        if(usertype=="Admin")
        {
             var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from costandutilization_data_tbl where inserted_by='"+bcbsri_id+"' "+costandutilization_month_q+" "+costandutilization_year_q+" "+costandutilization_risk_q+" "+costandutilization_search_q+") as totalrec,monthname as month_name FROM costandutilization_data_tbl WHERE inserted_by='"+bcbsri_id+"' "+costandutilization_month_q+" "+costandutilization_year_q+" "+costandutilization_risk_q+" "+costandutilization_search_q+" ORDER BY costandutilization_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from costandutilization_data_tbl where pcmh_id='"+pcmhid+"' "+costandutilization_month_q+" "+costandutilization_year_q+" "+costandutilization_risk_q+" "+costandutilization_search_q+") as totalrec, monthname as month_name FROM costandutilization_data_tbl WHERE pcmh_id='"+pcmhid+"' "+costandutilization_month_q+" "+costandutilization_year_q+" "+costandutilization_risk_q+" "+costandutilization_search_q+" ORDER BY costandutilization_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        } 
        
        request = new Request(query, function(err, rowCount) {
            if (err) {
                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement."
                };
                context.done();

            } else {
                context.res = {
                    status: 504,
                    body: "No Data Available"
                };
                context.done();
            }
        });

        costandutilizationdata=[];
        request.on('row', function(columns) {
            var rowObject_costandutilization = {};
            columns.forEach(function(column) {
               /* if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_costandutilization[column.metadata.colName] = column.value;
               
                }*/
                rowObject_costandutilization[column.metadata.colName] = column.value;
              
            });
            costandutilizationdata.push(rowObject_costandutilization);

        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": costandutilizationdata[0].totalrec,
                "recordsTotal": costandutilizationdata[0].totalrec,
                "data": costandutilizationdata
                });
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }

};