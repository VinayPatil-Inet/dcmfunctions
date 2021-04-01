var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var resultdata=[];
var demographicsdata = [];
var conditionsandriskdata = [];
var costandutilizationdata = [];
var bcbsriprogramdata = [];
var patientallmdata = [];
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
            var demographicsdatatype = searchParams.get('demographicsdatatype');
            var conditionsandriskype = searchParams.get('conditionsandriskype');
            var costandutilizationtype = searchParams.get('costandutilizationtype');
            var bcbsriprogramtype = searchParams.get('bcbsriprogramtype');
            var patientalldatatype = searchParams.get('patientalldatatype');
            var returnreportingdatatype = searchParams.get('returnreportingdatatype');
            
            
           // var datatype = req.body.datatype;
            if(demographicsdatatype=="demographics")
            {
                Demographics(usertype);
            }
            
           else if(conditionsandriskype=="conditionsandrisk")
            {
                conditionsandrisk(usertype);
            }

            else if(costandutilizationtype=="costandutilizationtype")
            {
                costandutilization(usertype);
            }
            
            else if(bcbsriprogramtype=="bcbsriprogram")
            {
                bcbsriprogram(usertype);
            }

            else if(patientalldatatype=="patientalldata")
            {
                patientalldata(usertype);
            }
            else if(returnreportingdatatype=="returnreporting")
            {
                returnreporting(usertype);
            }
            
        }
    });

    function Demographics(usertype) {

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
            // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');
        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from demographic_data_tbl where inserted_by='"+bcbsri_id+"') as totalrec,CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM demographic_data_tbl WHERE inserted_by='"+bcbsri_id+"' ORDER BY demographic_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
            
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from demographic_data_tbl where pcmh_id='"+pcmhid+"') as totalrec,CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM demographic_data_tbl WHERE pcmh_id='"+pcmhid+"' ORDER BY demographic_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
            
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
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }

    function conditionsandrisk(usertype) {

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
          //  var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');
        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from conditionsandrisk_data_tbl where inserted_by='"+bcbsri_id+"') as totalrec,CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM conditionsandrisk_data_tbl WHERE inserted_by='"+bcbsri_id+"' ORDER BY conditionsandrisk_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from conditionsandrisk_data_tbl where pcmh_id='"+pcmhid+"') as totalrec, CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM conditionsandrisk_data_tbl WHERE pcmh_id='"+pcmhid+"' ORDER BY conditionsandrisk_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                
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

        conditionsandriskdata=[];
        request.on('row', function(columns) {
            var rowObject_conditionrisk = {};
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_conditionrisk[column.metadata.colName] = column.value;
               
                }
               
              
            });
            conditionsandriskdata.push(rowObject_conditionrisk);

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


    function costandutilization(usertype) {

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
            // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');
        if(usertype=="Admin")
        {
             var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from costandutilization_data_tbl where inserted_by='"+bcbsri_id+"') as totalrec,CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM costandutilization_data_tbl WHERE inserted_by='"+bcbsri_id+"' ORDER BY costandutilization_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from costandutilization_data_tbl where pcmh_id='"+pcmhid+"') as totalrec, CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM costandutilization_data_tbl WHERE pcmh_id='"+pcmhid+"' ORDER BY costandutilization_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
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

        costandutilizationdata=[];
        request.on('row', function(columns) {
            var rowObject_costandutilization = {};
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_costandutilization[column.metadata.colName] = column.value;
               
                }
               
              
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


    function bcbsriprogram(usertype) {

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
            // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');
        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from bcbsriprogram_data_tbl where inserted_by='"+bcbsri_id+"') as totalrec,CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM bcbsriprogram_data_tbl WHERE inserted_by='"+bcbsri_id+"' ORDER BY bcbsriprogram_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from bcbsriprogram_data_tbl where pcmh_id='"+pcmhid+"') as totalrec, CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM bcbsriprogram_data_tbl WHERE pcmh_id='"+pcmhid+"' ORDER BY bcbsriprogram_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
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

        bcbsriprogramdata=[];
        request.on('row', function(columns) {
            var rowObject_bcbsriprogramdata = {};
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_bcbsriprogramdata[column.metadata.colName] = column.value;
               
                }
               
              
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
   

    function patientalldata(usertype) {
        // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');
        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from patientalldata_tbl where insrted_by='"+bcbsri_id+"') as totalrec,CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM patientalldata_tbl WHERE insrted_by='"+bcbsri_id+"' ORDER BY patientalldata_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from patientalldata_tbl where pcmh_id='"+pcmhid+"') as totalrec, CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM patientalldata_tbl where patientalldata_tbl.pcmh_id='"+pcmhid+"' ORDER BY patientalldata_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        } 

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
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

        patientallmdata=[];
        request.on('row', function(columns) {
            var rowObject_patientallmdata = {};
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_patientallmdata[column.metadata.colName] = column.value;
               
                }
               
              
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


    function returnreporting(usertype) {

        // var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(req.body);
            var start  = searchParams.get('start');
            var draw = searchParams.get('draw');
            var length = searchParams.get('length');

        if(usertype=="Admin")
        {
            var bcbsri_id = searchParams.get('logged_in_userid');
            var query = "SELECT *,(select count(*) from returnreport_data_tbl where inserted_by='"+bcbsri_id+"') as totalrec,CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM returnreport_data_tbl WHERE inserted_by='"+bcbsri_id+"' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }
        else
        {
            var pcmhid = searchParams.get('pcmhid');
            var query = "SELECT *,(select count(*) from returnreport_data_tbl where pcmh_id='"+pcmhid+"') as totalrec, CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM returnreport_data_tbl WHERE pcmh_id='"+pcmhid+"' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
                    
        }

        //request = new Request("select * FROM demographic_data_tbl INNER JOIN uploadedfiles_tbl ON uploadedfiles_tbl.uploadedfileid = demographic_data_tbl.uploadedfileid  WHERE uploadedfiles_tbl.pcmh_id='"+pcmhid+"' ", function(err, rowCount) {
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

        returnreportingdata=[];
        request.on('row', function(columns) {
            var rowObject_returnreportingdata = {};
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    rowObject_returnreportingdata[column.metadata.colName] = column.value;
               
                }
               
              
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