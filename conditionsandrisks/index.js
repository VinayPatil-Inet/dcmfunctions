var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var conditionsandriskdata = [];


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
            var conditionsandriskype = searchParams.get('conditionsandriskype');
            
            
           
                conditionsandrisk(usertype);
            
            
        }
    });


    function conditionsandrisk(usertype) {

             var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');

            var conditionsandrisk_month = searchParams.get('month');
            var conditionsandrisk_year = searchParams.get('year');
            var conditionsandrisk_risk = searchParams.get('risk');

            

            
           if(conditionsandrisk_month!="")
            {
            var conditionsandrisk_month_q = "and for_month="+conditionsandrisk_month;
            }
            else
            {
                var conditionsandrisk_month_q = "";
            }

            if(conditionsandrisk_year!="")
            {
            var conditionsandrisk_year_q = "and for_year="+conditionsandrisk_year;
            }
            else
            {
                var conditionsandrisk_year_q = "";
            }

            if(conditionsandrisk_risk!="")
            {
            var conditionsandrisk_risk_q = "and BCBSRI_Risk_Categorization='"+conditionsandrisk_risk+"'";
            }
            else
            {
                var conditionsandrisk_risk_q = "";
            }
            
            var conditionsandrisk_search = searchParams.get('search[value]');

            if(conditionsandrisk_search!="")
            {
                var conditionsandrisk_search_q = "and (for_year LIKE '%"+conditionsandrisk_search+"%' OR Mbr_Last_Name LIKE '%"+conditionsandrisk_search+"%' OR Mbr_First_Name LIKE '%"+conditionsandrisk_search+"%' OR BCBSRI_ID LIKE '%"+conditionsandrisk_search+"%' OR BCBSRI_Risk_Categorization LIKE '%"+conditionsandrisk_search+"%')";
            }
            else
            {
                var conditionsandrisk_search_q="";
            }

        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from conditionsandrisk_data_tbl where inserted_by='"+bcbsri_id+"' "+conditionsandrisk_month_q+" "+conditionsandrisk_year_q+" "+conditionsandrisk_risk_q+" "+conditionsandrisk_search_q+") as totalrec,monthname as month_name FROM conditionsandrisk_data_tbl WHERE inserted_by='"+bcbsri_id+"' "+conditionsandrisk_month_q+" "+conditionsandrisk_year_q+" "+conditionsandrisk_risk_q+" "+conditionsandrisk_search_q+" ORDER BY conditionsandrisk_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from conditionsandrisk_data_tbl where pcmh_id='"+pcmhid+"' "+conditionsandrisk_month_q+" "+conditionsandrisk_year_q+" "+conditionsandrisk_risk_q+" "+conditionsandrisk_search_q+") as totalrec, monthname as month_name FROM conditionsandrisk_data_tbl WHERE pcmh_id='"+pcmhid+"' "+conditionsandrisk_month_q+" "+conditionsandrisk_year_q+" "+conditionsandrisk_risk_q+" "+conditionsandrisk_search_q+" ORDER BY conditionsandrisk_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                
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

        conditionsandriskdata=[];
        request.on('row', function(columns) {
            

            var rowObject_conditionrisk = {};
            columns.forEach(function(column) {
               /* if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_conditionrisk[column.metadata.colName] = column.value;
               
                }
               */
              rowObject_conditionrisk[column.metadata.colName] = column.value;
              
            });
            conditionsandriskdata.push(rowObject_conditionrisk);

        });

        request.on('error', function (err) { 
            context.res = {
                body: "error Occured"
            };
            context.done();
        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {
            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": conditionsandriskdata[0].totalrec,
                "recordsTotal": conditionsandriskdata[0].totalrec,
                "data": conditionsandriskdata
                });
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }

};