var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var resultdata={};
var recentrowdata = [];
var inprocessrowdata=[];
var complatedrowdata=[];
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

            var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(url.search);
            
            
            var uploadedfileid = searchParams.get('uploadedfileid');
            var currentstatus = searchParams.get('currentstatus');
            var usertype=searchParams.get('usertype');
           

            if(currentstatus==1)
            {
                inprocess_review_return_report_individual_view(uploadedfileid,currentstatus,usertype);
            }
            else if(currentstatus==2)
            {
                complated_review_return_report_individual_view(uploadedfileid,currentstatus,usertype);
            }
            else if(currentstatus==-1)
            {
                review_return_report_details(uploadedfileid,usertype);
            }
            else
            {
                recent_review_return_report_individual_view(uploadedfileid,usertype);
            }

            
        }

        
    });

    function recent_review_return_report_individual_view(uploadedfileid,usertype) {
        var url = new URL(req.originalUrl);
        var searchParams = new URLSearchParams(url.search);
        var start  = searchParams.get('start');
        var draw = searchParams.get('draw');
        var length = searchParams.get('length');
        if(usertype=="PCMH")
        {
            if(uploadedfileid!="")
            {
                
                var query = "select *,(select count(*) from uploadedfiles_tbl where uploadedfileid='"+uploadedfileid+"' and currentstatus!='1' and currentstatus!='2') as totalrec, CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM returnreport_data_tbl WHERE uploadedfileid='"+uploadedfileid+"' and currentstatus!='1' and currentstatus!='2' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
            }
            else
            {
                //Display All return report individual for logged in pcmh
                

                 var pcmh_id = searchParams.get('pcmhid');
                 var query = "select *,(select count(*) from uploadedfiles_tbl inner join returnreport_data_tbl on returnreport_data_tbl.uploadedfileid=uploadedfiles_tbl.uploadedfileid where uploadedfiles_tbl.pcmh_id='"+pcmh_id+"' and currentstatus!='1' and currentstatus!='2') as totalrec, CASE WHEN returnreport_data_tbl.for_month = 1 THEN 'January' WHEN returnreport_data_tbl.for_month = 2 THEN 'February' WHEN returnreport_data_tbl.for_month = 3 THEN 'March' WHEN returnreport_data_tbl.for_month = 4 THEN 'April' WHEN returnreport_data_tbl.for_month = 5 THEN 'May' WHEN returnreport_data_tbl.for_month = 6 THEN 'June' WHEN returnreport_data_tbl.for_month = 7 THEN 'July' WHEN returnreport_data_tbl.for_month = 8 THEN 'August' WHEN returnreport_data_tbl.for_month = 9 THEN 'September' WHEN returnreport_data_tbl.for_month = 10 THEN 'October' WHEN returnreport_data_tbl.for_month = 11 THEN 'November' WHEN returnreport_data_tbl.for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM uploadedfiles_tbl inner join returnreport_data_tbl on returnreport_data_tbl.uploadedfileid=uploadedfiles_tbl.uploadedfileid where uploadedfiles_tbl.pcmh_id='"+pcmh_id+"' and currentstatus!='1' and currentstatus!='2' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY" ;
            }
        }
        else
        {
           
                var query = "select *,(select count(*) from uploadedfiles_tbl where uploadedfileid='"+uploadedfileid+"' and currentstatus!='1' and currentstatus!='2') as totalrec,pcmhname FROM returnreport_data_tbl LEFT JOIN pcmh_tbl on pcmh_tbl.pcmhid=returnreport_data_tbl.updated_by WHERE uploadedfileid='"+uploadedfileid+"' and currentstatus!='1' and currentstatus!='2' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
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

        recentrowdata=[];
        request.on('row', function(columns) {
            var recentrowObject = {};
            columns.forEach(function(column) {
               
               /* if (column.value === null) {
                    console.log('NULL');
                } else {
                    recentrowObject[column.metadata.colName] = column.value;
                }
               */
              recentrowObject[column.metadata.colName] = column.value;
              
            });
            recentrowdata.push(recentrowObject);
        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": recentrowdata[0].totalrec,
                "recordsTotal": recentrowdata[0].totalrec,
                "data": recentrowdata
                });
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }

    function inprocess_review_return_report_individual_view(uploadedfileid,currentstatus,usertype) {
        var url = new URL(req.originalUrl);
        var searchParams = new URLSearchParams(url.search);
        var start  = searchParams.get('start');
        var draw = searchParams.get('draw');
        var length = searchParams.get('length');

        if(usertype=="PCMH")
        {
            if(uploadedfileid!="")
            {
                var query = "select *,(select count(*) from uploadedfiles_tbl where uploadedfileid='"+uploadedfileid+"' and currentstatus='"+currentstatus+"') as totalrec, CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM returnreport_data_tbl WHERE uploadedfileid='"+uploadedfileid+"' and currentstatus='"+currentstatus+"' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
            }
            else
            {
                //Display All return report individual for logged in pcmh
                var pcmh_id = searchParams.get('pcmhid');
                var query = "select *,(select count(*) from uploadedfiles_tbl inner join returnreport_data_tbl on returnreport_data_tbl.uploadedfileid=uploadedfiles_tbl.uploadedfileid where uploadedfiles_tbl.pcmh_id='"+pcmh_id+"' and returnreport_data_tbl.currentstatus='"+currentstatus+"') as totalrec, CASE WHEN returnreport_data_tbl.for_month = 1 THEN 'January' WHEN returnreport_data_tbl.for_month = 2 THEN 'February' WHEN returnreport_data_tbl.for_month = 3 THEN 'March' WHEN returnreport_data_tbl.for_month = 4 THEN 'April' WHEN returnreport_data_tbl.for_month = 5 THEN 'May' WHEN returnreport_data_tbl.for_month = 6 THEN 'June' WHEN returnreport_data_tbl.for_month = 7 THEN 'July' WHEN returnreport_data_tbl.for_month = 8 THEN 'August' WHEN returnreport_data_tbl.for_month = 9 THEN 'September' WHEN returnreport_data_tbl.for_month = 10 THEN 'October' WHEN returnreport_data_tbl.for_month = 11 THEN 'November' WHEN returnreport_data_tbl.for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM uploadedfiles_tbl inner join returnreport_data_tbl on returnreport_data_tbl.uploadedfileid=uploadedfiles_tbl.uploadedfileid where uploadedfiles_tbl.pcmh_id='"+pcmh_id+"' and returnreport_data_tbl.currentstatus='"+currentstatus+"' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY" ;
            }
        }
        else
        {
            var query = "select *,(select count(*) from returnreport_data_tbl where uploadedfileid='"+uploadedfileid+"' and currentstatus='"+currentstatus+"') as totalrec,pcmhname FROM returnreport_data_tbl LEFT JOIN pcmh_tbl on pcmh_tbl.pcmhid=returnreport_data_tbl.updated_by  WHERE uploadedfileid='"+uploadedfileid+"' and currentstatus='"+currentstatus+"' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
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

        inprocessrowdata=[];
        request.on('row', function(columns) {
            var inprocessrowObject = {};
            columns.forEach(function(column) {
               /* if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    inprocessrowObject[column.metadata.colName] = column.value;
                // resultdata.push(column.value)
                }*/
                inprocessrowObject[column.metadata.colName] = column.value;
              
            });
           
            inprocessrowdata.push(inprocessrowObject);
        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": inprocessrowdata[0].totalrec,
                "recordsTotal": inprocessrowdata[0].totalrec,
                "data": inprocessrowdata
                });
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }


    function complated_review_return_report_individual_view(uploadedfileid,currentstatus,usertype) {
        var url = new URL(req.originalUrl);
        var searchParams = new URLSearchParams(url.search);
        var start  = searchParams.get('start');
        var draw = searchParams.get('draw');
        var length = searchParams.get('length');
       
        if(usertype=="PCMH")
        {
            if(uploadedfileid!="")
            {
                var query = "select *,(select count(*) from returnreport_data_tbl where uploadedfileid='"+uploadedfileid+"' and currentstatus='"+currentstatus+"') as totalrec,CASE WHEN for_month = 1 THEN 'January' WHEN for_month = 2 THEN 'February' WHEN for_month = 3 THEN 'March' WHEN for_month = 4 THEN 'April' WHEN for_month = 5 THEN 'May' WHEN for_month = 6 THEN 'June' WHEN for_month = 7 THEN 'July' WHEN for_month = 8 THEN 'August' WHEN for_month = 9 THEN 'September' WHEN for_month = 10 THEN 'October' WHEN for_month = 11 THEN 'November' WHEN for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM returnreport_data_tbl WHERE uploadedfileid='"+uploadedfileid+"' and currentstatus='"+currentstatus+"' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
            }
            else
            {
                //Display All return report individual for logged in pcmh
                var pcmh_id = searchParams.get('pcmhid');
                 var query = "select *,(select count(*) from uploadedfiles_tbl inner join returnreport_data_tbl on returnreport_data_tbl.uploadedfileid=uploadedfiles_tbl.uploadedfileid where uploadedfiles_tbl.pcmh_id='"+pcmh_id+"' and returnreport_data_tbl.currentstatus='"+currentstatus+"') as totalrec,CASE WHEN returnreport_data_tbl.for_month = 1 THEN 'January' WHEN returnreport_data_tbl.for_month = 2 THEN 'February' WHEN returnreport_data_tbl.for_month = 3 THEN 'March' WHEN returnreport_data_tbl.for_month = 4 THEN 'April' WHEN returnreport_data_tbl.for_month = 5 THEN 'May' WHEN returnreport_data_tbl.for_month = 6 THEN 'June' WHEN returnreport_data_tbl.for_month = 7 THEN 'July' WHEN returnreport_data_tbl.for_month = 8 THEN 'August' WHEN returnreport_data_tbl.for_month = 9 THEN 'September' WHEN returnreport_data_tbl.for_month = 10 THEN 'October' WHEN returnreport_data_tbl.for_month = 11 THEN 'November' WHEN returnreport_data_tbl.for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM uploadedfiles_tbl inner join returnreport_data_tbl on returnreport_data_tbl.uploadedfileid=uploadedfiles_tbl.uploadedfileid where uploadedfiles_tbl.pcmh_id='"+pcmh_id+"' and returnreport_data_tbl.currentstatus='"+currentstatus+"' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY" ;
            }
        }
        else
        {
            var query = "select *,(select count(*) from returnreport_data_tbl where uploadedfileid='"+uploadedfileid+"' and currentstatus='"+currentstatus+"') as totalrec,pcmhname FROM returnreport_data_tbl LEFT JOIN pcmh_tbl on pcmh_tbl.pcmhid=returnreport_data_tbl.updated_by  WHERE uploadedfileid='"+uploadedfileid+"' and currentstatus='"+currentstatus+"' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
        }

        request = new Request(query, function(err, rowCount) {
            if (err) {
                // context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement."
                };
                context.done();

            } else {
                context.res = {
                    status: 504,
                    body: "No data found."
                };
                context.done();
            }
        });

        complatedrowdata=[];
        request.on('row', function(columns) {
            var complatedrowObject = {};
            columns.forEach(function(column) {
               /* if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    complatedrowObject[column.metadata.colName] = column.value;
                // resultdata.push(column.value)
                }*/
                complatedrowObject[column.metadata.colName] = column.value;
              
            });
           
            complatedrowdata.push(complatedrowObject);
        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": complatedrowdata[0].totalrec,
                "recordsTotal": complatedrowdata[0].totalrec,
                "data": complatedrowdata
                });
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }


   
    function review_return_report_details(uploadedfileid,usertype) {
       
      //  if(usertype==2)
      //  {
      //      var query = "select * FROM returnreport_data_tbl WHERE uploadedfileid='"+uploadedfileid+"' and currentstatus!='"+currentstatus+"'";
      //  }
      //  else
      //  {
       //     var query = "select returnreport_data_tbl.uploadedfileid,username,uploadedfiles_tbl.for_year,uploadedfiles_tbl.filename,CASE WHEN uploadedfiles_tbl.for_month = 1 THEN 'January' WHEN uploadedfiles_tbl.for_month = 2 THEN 'February' WHEN uploadedfiles_tbl.for_month = 3 THEN 'March' WHEN uploadedfiles_tbl.for_month = 4 THEN 'April' WHEN uploadedfiles_tbl.for_month = 5 THEN 'May' WHEN uploadedfiles_tbl.for_month = 6 THEN 'June' WHEN uploadedfiles_tbl.for_month = 7 THEN 'July' WHEN uploadedfiles_tbl.for_month = 8 THEN 'August' WHEN uploadedfiles_tbl.for_month = 9 THEN 'September' WHEN uploadedfiles_tbl.for_month = 10 THEN 'October' WHEN uploadedfiles_tbl.for_month = 11 THEN 'November' WHEN uploadedfiles_tbl.for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM returnreport_data_tbl inner join user_tbl on user_tbl.userid=returnreport_data_tbl.inserted_by inner join uploadedfiles_tbl on uploadedfiles_tbl.uploadedfileid=returnreport_data_tbl.uploadedfileid WHERE returnreport_data_tbl.uploadedfileid='"+uploadedfileid+"'";
       // }

       var query = "select returnreport_data_tbl.uploadedfileid,username,uploadedfiles_tbl.for_year,uploadedfiles_tbl.filename,CASE WHEN uploadedfiles_tbl.for_month = 1 THEN 'January' WHEN uploadedfiles_tbl.for_month = 2 THEN 'February' WHEN uploadedfiles_tbl.for_month = 3 THEN 'March' WHEN uploadedfiles_tbl.for_month = 4 THEN 'April' WHEN uploadedfiles_tbl.for_month = 5 THEN 'May' WHEN uploadedfiles_tbl.for_month = 6 THEN 'June' WHEN uploadedfiles_tbl.for_month = 7 THEN 'July' WHEN uploadedfiles_tbl.for_month = 8 THEN 'August' WHEN uploadedfiles_tbl.for_month = 9 THEN 'September' WHEN uploadedfiles_tbl.for_month = 10 THEN 'October' WHEN uploadedfiles_tbl.for_month = 11 THEN 'November' WHEN uploadedfiles_tbl.for_month = 12 THEN 'December' ELSE 'OTHER' END AS month_name FROM returnreport_data_tbl inner join user_tbl on user_tbl.userid=returnreport_data_tbl.inserted_by inner join uploadedfiles_tbl on uploadedfiles_tbl.uploadedfileid=returnreport_data_tbl.uploadedfileid WHERE returnreport_data_tbl.uploadedfileid='"+uploadedfileid+"' ORDER BY returnreport_data_id DESC";
        request = new Request(query, function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement2."
                };
                context.done();

            } else {
                context.log(rowCount + ' rows');
            }
        });

        request.on('row', function(columns) {
            columns.forEach(function(column) {
               
                //context.log(column.value);
                resultdata[column.metadata.colName] = column.value;
               // resultdata.push(column.value)
               
              
            });
            
            //context.log(resultdata);
            context.res = {
                body: resultdata
            };
            
            context.done();
        });

        connection.execSql(request);
    }

};