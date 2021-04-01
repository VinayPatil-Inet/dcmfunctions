var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var patientallmdata = [];


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
            var patientalldatatype = searchParams.get('patientalldatatype');
            
            patientalldata(usertype);
            
            
        }
    });


    function patientalldata(usertype) {
        // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');

            var patientalldata_month = searchParams.get('month');
            var patientalldata_year = searchParams.get('year');
            var patientalldata_risk = searchParams.get('risk');

            

            
           if(patientalldata_month!="")
            {
            var patientalldata_month_q = "and for_month="+patientalldata_month;
            }
            else
            {
                var patientalldata_month_q = "";
            }

            if(patientalldata_year!="")
            {
            var patientalldata_year_q = "and for_year="+patientalldata_year;
            }
            else
            {
                var patientalldata_year_q = "";
            }

            if(patientalldata_risk!="")
            {
            var patientalldata_risk_q = "and BCBSRI_Risk_Categorization='"+patientalldata_risk+"'";
            }
            else
            {
                var patientalldata_risk_q = "";
            }
            
            var patientalldata_search = searchParams.get('search[value]');

            if(patientalldata_search!="")
            {
                var patientalldata_search_q = "and (for_year LIKE '%"+patientalldata_search+"%' OR Mbr_Last_Name LIKE '%"+patientalldata_search+"%' OR Mbr_First_Name LIKE '%"+patientalldata_search+"%' OR  BCBSRI_ID LIKE '%"+patientalldata_search+"%' OR  BCBSRI_Risk_Categorization LIKE '%"+patientalldata_search+"%')";
            }
            else
            {
                var patientalldata_search_q="";
            }

        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from patientalldata_tbl where insrted_by='"+bcbsri_id+"' "+patientalldata_month_q+" "+patientalldata_year_q+" "+patientalldata_risk_q+" "+patientalldata_search_q+") as totalrec,monthname as month_name FROM patientalldata_tbl WHERE insrted_by='"+bcbsri_id+"' "+patientalldata_month_q+" "+patientalldata_year_q+" "+patientalldata_risk_q+" "+patientalldata_search_q+" ORDER BY patientalldata_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from patientalldata_tbl where pcmh_id='"+pcmhid+"' "+patientalldata_month_q+" "+patientalldata_year_q+" "+patientalldata_risk_q+" "+patientalldata_search_q+") as totalrec, monthname as month_name FROM patientalldata_tbl where patientalldata_tbl.pcmh_id='"+pcmhid+"' "+patientalldata_month_q+" "+patientalldata_year_q+" "+patientalldata_risk_q+" "+patientalldata_search_q+" ORDER BY patientalldata_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
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

        patientallmdata=[];
        request.on('row', function(columns) {
            var rowObject_patientallmdata = {};
            columns.forEach(function(column) {
                /*if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_patientallmdata[column.metadata.colName] = column.value;
               
                }*/
                rowObject_patientallmdata[column.metadata.colName] = column.value;
              
            });
            patientallmdata.push(rowObject_patientallmdata);

        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": patientallmdata[0].totalrec,
                "recordsTotal": patientallmdata[0].totalrec,
                "data": patientallmdata
                });
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }

};