var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var bcbsriprogramdata = [];


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
            var bcbsriprogramtype = searchParams.get('bcbsriprogramtype');
            
             bcbsriprogram(usertype);
            
            
        }
    });


    function bcbsriprogram(usertype) {

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
            // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');

            var bcbsriprogram_month = searchParams.get('month');
            var bcbsriprogram_year = searchParams.get('year');
            var bcbsriprogram_risk = searchParams.get('risk');

            

            
           if(bcbsriprogram_month!="")
            {
            var bcbsriprogram_month_q = "and for_month="+bcbsriprogram_month;
            }
            else
            {
                var bcbsriprogram_month_q = "";
            }

            if(bcbsriprogram_year!="")
            {
            var bcbsriprogram_year_q = "and for_year="+bcbsriprogram_year;
            }
            else
            {
                var bcbsriprogram_year_q = "";
            }

            if(bcbsriprogram_risk!="")
            {
            var bcbsriprogram_risk_q = "and BCBSRI_Risk_Categorization='"+bcbsriprogram_risk+"'";
            }
            else
            {
                var bcbsriprogram_risk_q = "";
            }
            
            var bcbsriprogram_search = searchParams.get('search[value]');

            if(bcbsriprogram_search!="")
            {
                var bcbsriprogram_search_q = "and (for_year LIKE '%"+bcbsriprogram_search+"%' OR Mbr_Last_Name LIKE '%"+bcbsriprogram_search+"%' OR Mbr_First_Name LIKE '%"+bcbsriprogram_search+"%' OR BCBSRI_ID LIKE '%"+bcbsriprogram_search+"%' OR BCBSRI_Risk_Categorization LIKE '%"+bcbsriprogram_search+"%')";
            }
            else
            {
                var bcbsriprogram_search_q="";
            }

        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from bcbsriprogram_data_tbl where inserted_by='"+bcbsri_id+"' "+bcbsriprogram_month_q+" "+bcbsriprogram_year_q+" "+bcbsriprogram_risk_q+" "+bcbsriprogram_search_q+") as totalrec,monthname as month_name FROM bcbsriprogram_data_tbl WHERE inserted_by='"+bcbsri_id+"' "+bcbsriprogram_month_q+" "+bcbsriprogram_year_q+" "+bcbsriprogram_risk_q+" "+bcbsriprogram_search_q+" ORDER BY bcbsriprogram_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from bcbsriprogram_data_tbl where pcmh_id='"+pcmhid+"' "+bcbsriprogram_month_q+" "+bcbsriprogram_year_q+" "+bcbsriprogram_risk_q+" "+bcbsriprogram_search_q+") as totalrec, monthname as month_name FROM bcbsriprogram_data_tbl WHERE pcmh_id='"+pcmhid+"' "+bcbsriprogram_month_q+" "+bcbsriprogram_year_q+" "+bcbsriprogram_risk_q+" "+bcbsriprogram_search_q+" ORDER BY bcbsriprogram_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
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

        bcbsriprogramdata=[];
        request.on('row', function(columns) {
            var rowObject_bcbsriprogramdata = {};
            columns.forEach(function(column) {
                /*if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_bcbsriprogramdata[column.metadata.colName] = column.value;
               
                }*/
                rowObject_bcbsriprogramdata[column.metadata.colName] = column.value;
               
              
            });
            bcbsriprogramdata.push(rowObject_bcbsriprogramdata);

        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": bcbsriprogramdata[0].totalrec,
                "recordsTotal": bcbsriprogramdata[0].totalrec,
                "data": bcbsriprogramdata
                });
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }
   


};