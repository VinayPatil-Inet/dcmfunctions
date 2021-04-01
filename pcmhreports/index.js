var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var demographicsdata = [];

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
            var demographicsdatatype = searchParams.get('demographicsdatatype');
            
            
            Demographics(usertype);
           
            
        }
    });

    function Demographics(usertype) {

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
            // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');

            var demographics_month = searchParams.get('month');
            var demographics_year = searchParams.get('year');
            var demographics_risk = searchParams.get('risk');

            

            
           if(demographics_month!="")
            {
            var demographics_month_q = "and for_month="+demographics_month;
            }
            else
            {
                var demographics_month_q = "";
            }

            if(demographics_year!="")
            {
            var demographics_year_q = "and for_year="+demographics_year;
            }
            else
            {
                var demographics_year_q = "";
            }

            if(demographics_risk!="")
            {
            var demographics_risk_q = "and BCBSRI_Risk_Categorization='"+demographics_risk+"'";
            }
            else
            {
                var demographics_risk_q = "";
            }
            
            var demographics_search = searchParams.get('search[value]');

            if(demographics_search!="")
            {
               // var search_q = "and for_year LIKE '%"+search+"%' OR Mbr_Last_Name LIKE '%"+search+"%' OR Mbr_First_Name '%"+search+"%'";
               var demographics_search_q = "and (for_year LIKE '%"+demographics_search+"%' OR Mbr_Last_Name LIKE '%"+demographics_search+"%' OR Mbr_First_Name LIKE '%"+demographics_search+"%'  OR BCBSRI_ID LIKE '%"+demographics_search+"%' OR BCBSRI_Risk_Categorization LIKE '%"+demographics_search+"%')";
            }
            else
            {
                var demographics_search_q="";
            }


        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from demographic_data_tbl where inserted_by='"+bcbsri_id+"' "+demographics_month_q+" "+demographics_year_q+" "+demographics_risk_q+" "+demographics_search_q+") as totalrec,monthname as month_name FROM demographic_data_tbl WHERE inserted_by='"+bcbsri_id+"' "+demographics_month_q+" "+demographics_year_q+" "+demographics_risk_q+" "+demographics_search_q+" ORDER BY demographic_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
            
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from demographic_data_tbl where pcmh_id='"+pcmhid+"' "+demographics_month_q+" "+demographics_year_q+" "+demographics_risk_q+" "+demographics_search_q+") as totalrec,monthname as month_name FROM demographic_data_tbl WHERE pcmh_id='"+pcmhid+"' "+demographics_month_q+" "+demographics_year_q+" "+demographics_risk_q+" "+demographics_search_q+" ORDER BY demographic_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
            
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


        demographicsdata=[];
        request.on('row', function(columns) {
            var rowObject = {};
            columns.forEach(function(column) {
                // if (column.value === null) {
                //     console.log('NULL');
                // } else {
                    //context.log(column.value);
                    rowObject[column.metadata.colName] = column.value;
               
                // }
               
              
            });
            demographicsdata.push(rowObject);

        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": demographicsdata[0].totalrec,
                "recordsTotal": demographicsdata[0].totalrec,
                "data": demographicsdata
                });
                //context.log("sdfdsfsd = "+rowCount);
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }

   

};