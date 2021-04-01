var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var returnreportingdata = [];

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
            var returnreportingdatatype = searchParams.get('returnreportingdatatype');
            
            
                returnreporting(usertype);
            
            
        }
    });


    function returnreporting(usertype) {

        // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');

            var returnreporting_month = searchParams.get('month');
            var returnreporting_year = searchParams.get('year');
            var returnreporting_risk = searchParams.get('risk');

            var returnreporting_search = searchParams.get('search[value]');

            

            
           if(returnreporting_month!="")
            {
            var returnreporting_month_q = "and for_month="+returnreporting_month;
            }
            else
            {
                var returnreporting_month_q = "";
            }

            if(returnreporting_year!="")
            {
            var returnreporting_year_q = "and for_year="+returnreporting_year;
            }
            else
            {
                var returnreporting_year_q = "";
            }

            if(returnreporting_risk!="")
            {
                var returnreporting_risk_q = "and (BCBSRI_Risk_Categorization='"+returnreporting_risk+"')"
            }
            else
            {
                var returnreporting_risk_q = "";
            }
            
            

            if(returnreporting_search!="")
            {
                var returnreporting_search_q = "and (for_year LIKE '%"+returnreporting_search+"%' OR Mbr_Last_Name LIKE '%"+returnreporting_search+"%' OR Mbr_First_Name LIKE '%"+returnreporting_search+"%' OR BCBSRI_ID LIKE '%"+returnreporting_search+"%' OR BCBSRI_Risk_Categorization LIKE '%"+returnreporting_search+"%')";
               
            }
            else
            {
                var returnreporting_search_q="";
            }

        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from returnreport_data_tbl where inserted_by='"+bcbsri_id+"' "+returnreporting_month_q+" "+returnreporting_year_q+" "+returnreporting_risk_q+"  "+returnreporting_search_q+") as totalrec,monthname as month_name FROM returnreport_data_tbl WHERE inserted_by='"+bcbsri_id+"' "+returnreporting_month_q+" "+returnreporting_year_q+" "+returnreporting_risk_q+" "+returnreporting_search_q+" ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from returnreport_data_tbl where pcmh_id='"+pcmhid+"' "+returnreporting_month_q+" "+returnreporting_year_q+" "+returnreporting_risk_q+" "+returnreporting_search_q+") as totalrec, monthname as month_name FROM returnreport_data_tbl WHERE pcmh_id='"+pcmhid+"' "+returnreporting_month_q+" "+returnreporting_year_q+" "+returnreporting_risk_q+" "+returnreporting_search_q+" ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
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

        returnreportingdata=[];
        request.on('row', function(columns) {
            var rowObject_returnreportingdata = {};
            columns.forEach(function(column) {
                /*if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_returnreportingdata[column.metadata.colName] = column.value;
               
                }
               */
              rowObject_returnreportingdata[column.metadata.colName] = column.value;
            });
            returnreportingdata.push(rowObject_returnreportingdata);

        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": returnreportingdata[0].totalrec,
                "recordsTotal": returnreportingdata[0].totalrec,
                "data": returnreportingdata
                });
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }

};