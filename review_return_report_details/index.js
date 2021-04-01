var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var resultdata={};


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

                   
            
            var uploadedfileid = req.body.uploadedfileid;
           
            
                review_return_report_details(uploadedfileid);
          
            
        }

        
    });

    


   
    function review_return_report_details(uploadedfileid) {
       
     
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